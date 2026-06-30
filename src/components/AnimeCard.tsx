import { Card, Image, Text, Badge, Group, Stack, AspectRatio } from '@mantine/core';
import type { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onClick?: () => void;
}

export function AnimeCard({ anime, onClick }: AnimeCardProps) {
  const imageUrl = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const truncatedSynopsis = anime.synopsis
    ? anime.synopsis.length > 200
      ? anime.synopsis.slice(0, 200) + '…'
      : anime.synopsis
    : 'No synopsis available.';

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Section>
        <AspectRatio ratio={3 / 4}>
          <Image
            src={imageUrl}
            alt={anime.title}
            fallbackSrc="https://placehold.co/225x300/1a1a2e/eeeeee?text=No+Image"
          />
        </AspectRatio>
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Text fw={700} lineClamp={2} size="sm">
          {anime.title_english || anime.title}
        </Text>

        <Group gap="xs">
          {anime.score && (
            <Badge color="yellow" variant="light" size="sm">
              ★ {anime.score}
            </Badge>
          )}
          {anime.type && (
            <Badge color="grape" variant="light" size="sm">
              {anime.type}
            </Badge>
          )}
          {anime.episodes && (
            <Badge color="cyan" variant="light" size="sm">
              {anime.episodes} eps
            </Badge>
          )}
        </Group>

        <Text size="xs" c="dimmed" lineClamp={4}>
          {truncatedSynopsis}
        </Text>

        <Group gap="xs">
          {anime.status && (
            <Badge color={anime.airing ? 'green' : 'gray'} variant="dot" size="sm">
              {anime.status}
            </Badge>
          )}
          {anime.season && anime.year && (
            <Text size="xs" c="dimmed">
              {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
            </Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
