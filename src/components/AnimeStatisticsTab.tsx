import { useEffect, useRef, useState } from 'react';
import { SimpleGrid, Text, Stack, Skeleton, Alert } from '@mantine/core';
import { BarChart, DonutChart } from '@mantine/charts';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchAnimeStatistics } from '../services/tenrai';
import type { AnimeStatistics } from '../types/anime';

interface AnimeStatisticsTabProps {
  animeId: number;
}

export function AnimeStatisticsTab({ animeId }: AnimeStatisticsTabProps) {
  const [stats, setStats] = useState<AnimeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnimeStatistics(animeId)
      .then((res) => {
        if (!cancelled) {
          setStats(res.data);
          setLoading(false);
          loadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load statistics');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [animeId]);

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
        {error}
      </Alert>
    );
  }

  if (loading || !stats) {
    return (
      <Stack py="md" gap="md">
        <Skeleton height={24} width={200} />
        <Skeleton height={300} />
        <Skeleton height={24} width={200} />
        <Skeleton height={300} />
      </Stack>
    );
  }

  const scoreData = stats.scores.map((s) => ({
    score: String(s.score),
    votes: s.votes,
  }));

  const statusData = [
    { name: 'Watching', value: stats.watching, color: 'blue.6' },
    { name: 'Completed', value: stats.completed, color: 'green.6' },
    { name: 'On Hold', value: stats.on_hold, color: 'yellow.6' },
    { name: 'Dropped', value: stats.dropped, color: 'red.6' },
    { name: 'Plan to Watch', value: stats.plan_to_watch, color: 'grape.6' },
  ];

  return (
    <Stack py="md" gap="xl">
      <div>
        <Text fw={600} size="sm" mb="md">Score Distribution</Text>
        <BarChart
          h={300}
          data={scoreData}
          dataKey="score"
          series={[{ name: 'votes', color: 'blue.6' }]}
          tickLine="y"
          gridAxis="y"
          withTooltip
          tooltipAnimationDuration={200}
        />
      </div>

      <div>
        <Text fw={600} size="sm" mb="md">Status Breakdown</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <DonutChart
            data={statusData}
            withLabels
            withTooltip
            tooltipDataSource="segment"
            style={{ margin: '0 auto' }}
          />
          <Stack gap="sm" justify="center">
            {statusData.map((item) => (
              <Text key={item.name} size="sm">
                {item.name}: {item.value.toLocaleString()}
              </Text>
            ))}
          </Stack>
        </SimpleGrid>
      </div>
    </Stack>
  );
}
