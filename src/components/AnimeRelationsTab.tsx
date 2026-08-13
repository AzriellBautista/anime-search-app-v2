import { useEffect, useRef, useState } from 'react';
import { Stack, Text, Badge, Anchor, Divider, Skeleton, Alert, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchAnimeRelations } from '../services/tenrai';
import type { AnimeRelation } from '../types/anime';

interface AnimeRelationsTabProps {
  animeId: number;
}

const typeColors: Record<string, string> = {
  anime: 'blue',
  manga: 'red',
  person: 'violet',
  character: 'teal',
};

function entryTypeColor(type: string): string {
  return typeColors[type] || 'gray';
}

export function AnimeRelationsTab({ animeId }: AnimeRelationsTabProps) {
  const [relations, setRelations] = useState<AnimeRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnimeRelations(animeId)
      .then((res) => {
        if (!cancelled) {
          setRelations(res.data);
          setLoading(false);
          loadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load relations');
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

  if (loading) {
    return (
      <Stack py="md" gap="md">
        <Skeleton height={24} width={160} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={24} width={160} />
        <Skeleton height={20} />
      </Stack>
    );
  }

  if (relations.length === 0) {
    return (
      <Text c="dimmed" size="sm" py="md">
        No relations found for this anime.
      </Text>
    );
  }

  return (
    <Stack py="md" gap="lg">
      {relations.map((rel, idx) => (
        <div key={idx}>
          {idx > 0 && <Divider mb="lg" />}
          <Text fw={600} size="sm" mb="xs">{rel.relation}</Text>
          <Stack gap="xs">
            {rel.entry.map((entry) => (
              <Group key={`${entry.mal_id}-${entry.type}`} gap="xs" wrap="nowrap">
                <Badge
                  color={entryTypeColor(entry.type)}
                  variant="light"
                  size="sm"
                  style={{ flexShrink: 0, textTransform: 'capitalize' }}
                >
                  {entry.type}
                </Badge>
                <Anchor
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  lineClamp={1}
                >
                  {entry.name}
                </Anchor>
              </Group>
            ))}
          </Stack>
        </div>
      ))}
    </Stack>
  );
}
