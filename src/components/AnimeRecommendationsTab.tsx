import { useEffect, useRef, useState } from 'react';
import { SimpleGrid, Card, Image, Text, Badge, Stack, AspectRatio, Skeleton, Anchor, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchAnimeRecommendations } from '../services/jikan';
import type { AnimeRecommendation } from '../types/anime';

interface AnimeRecommendationsTabProps {
  animeId: number;
}

export function AnimeRecommendationsTab({ animeId }: AnimeRecommendationsTabProps) {
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnimeRecommendations(animeId)
      .then((res) => {
        if (!cancelled) {
          setRecommendations(res.data);
          setLoading(false);
          loadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load recommendations');
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
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md" py="md">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} padding={0} radius="md" withBorder>
            <AspectRatio ratio={3 / 4}>
              <Skeleton />
            </AspectRatio>
            <Stack p="xs" gap={4}>
              <Skeleton height={14} />
              <Skeleton height={12} width={60} />
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Text c="dimmed" size="sm" py="md">
        No recommendations found for this anime.
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md" py="md">
      {recommendations.map((rec) => {
        const imageUrl = rec.entry.images.webp?.large_image_url || rec.entry.images.jpg.large_image_url;
        return (
          <Card key={rec.entry.mal_id} padding={0} radius="md" withBorder>
            <Card.Section>
              <AspectRatio ratio={3 / 4}>
                <Image src={imageUrl} alt={rec.entry.title} />
              </AspectRatio>
            </Card.Section>
            <Stack p="xs" gap={4}>
              <Anchor
                href={rec.entry.url}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                lineClamp={2}
                fw={500}
              >
                {rec.entry.title}
              </Anchor>
              <Badge size="sm" variant="light" color="gray">
                {rec.votes} vote{rec.votes !== 1 ? 's' : ''}
              </Badge>
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
