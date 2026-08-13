import { useEffect, useRef, useState } from 'react';
import { SimpleGrid, Card, Image, Text, Badge, Group, AspectRatio, Skeleton, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchAnimeCharacters } from '../services/tenrai';
import type { AnimeCharacter } from '../types/anime';

interface AnimeCharactersTabProps {
  animeId: number;
}

function sortCharacters(data: AnimeCharacter[]): AnimeCharacter[] {
  const order: Record<string, number> = { 'Main': 0, 'Supporting': 1 };
  return [...data].sort((a, b) => (order[a.role] ?? 2) - (order[b.role] ?? 2));
}

export function AnimeCharactersTab({ animeId }: AnimeCharactersTabProps) {
  const [data, setData] = useState<AnimeCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnimeCharacters(animeId)
      .then((res) => {
        if (!cancelled) {
          setData(sortCharacters(res.data));
          setLoading(false);
          loadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load characters');
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
          <Card key={i} shadow="sm" padding="xs" radius="md" withBorder>
            <AspectRatio ratio={3 / 4} mb="xs">
              <Skeleton radius="sm" />
            </AspectRatio>
            <Skeleton height={14} width="80%" mb={4} />
            <Skeleton height={12} width="50%" />
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md" py="md">
      {data.map((entry) => {
        const char = entry.character;
        const imgUrl = char.images?.jpg?.image_url;
        const mainVa = entry.voice_actors?.find((va) => va.language === 'Japanese');
        return (
          <Card key={char.mal_id} shadow="sm" padding="xs" radius="md" withBorder>
            <AspectRatio ratio={3 / 4} mb="xs">
              <Image src={imgUrl} alt={char.name} radius="sm" />
            </AspectRatio>
            <Text size="sm" fw={500} lineClamp={2} mb={2}>{char.name}</Text>
            <Group gap={4} mb={4}>
              <Badge size="xs" color={entry.role === 'Main' ? 'blue' : 'gray'} variant="light">
                {entry.role}
              </Badge>
              {entry.favorites > 0 && (
                <Badge size="xs" color="pink" variant="light">♥ {entry.favorites}</Badge>
              )}
            </Group>
            {mainVa && (
              <Text size="xs" c="dimmed" lineClamp={1}>
                {mainVa.person.name}
              </Text>
            )}
            {mainVa && (
              <Text size="xs" c="dimmed">{mainVa.language}</Text>
            )}
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
