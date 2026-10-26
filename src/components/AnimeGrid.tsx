import { useState, useEffect } from 'react';
import { SimpleGrid, Center, Text, Stack, Group, Skeleton, Card, AspectRatio, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import type { Anime } from '../types/anime';
import { AnimeCard } from './AnimeCard';
import { AnimeDetailModal } from './AnimeDetailModal';
import { fetchAnimeById } from '../services/tenrai';

interface AnimeGridProps {
  data: Anime[];
  loading: boolean;
  error: string | null;
}

function SkeletonCard() {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section>
        <AspectRatio ratio={3 / 4}>
          <Skeleton radius={0} />
        </AspectRatio>
      </Card.Section>
      <Stack gap="xs" mt="md">
        <Skeleton height={20} width="75%" />
        <Group gap="xs">
          <Skeleton height={20} width={48} radius="sm" />
          <Skeleton height={20} width={36} radius="sm" />
          <Skeleton height={20} width={56} radius="sm" />
        </Group>
        <Stack gap={4}>
          <Skeleton height={14} />
          <Skeleton height={14} width="85%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={14} width="40%" />
        </Stack>
        <Group gap="xs">
          <Skeleton height={20} width={60} radius="sm" />
          <Skeleton height={14} width={50} />
        </Group>
      </Stack>
    </Card>
  );
}

export function AnimeGrid({ data, loading, error }: AnimeGridProps) {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [hashAnime, setHashAnime] = useState<Anime | null>(null);
  const [hashLoading, setHashLoading] = useState(false);

  const readHash = () => {
    const raw = window.location.hash.replace('#', '').trim();
    const id = Number(raw);
    if (!raw || Number.isNaN(id)) {
      setHashAnime(null);
      return;
    }
    // Switching to a hash-driven anime: drop any search-card selection so the
    // new anime takes over the modal instead of stacking behind it.
    setSelectedAnime(null);
    setHashLoading(true);
    fetchAnimeById(id)
      .then((res) => setHashAnime(res.data))
      .catch(() => setHashAnime(null))
      .finally(() => setHashLoading(false));
  };

  useEffect(() => {
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  const modalAnime = selectedAnime ?? hashAnime;
  const modalOpened = selectedAnime !== null || hashAnime !== null || hashLoading;

  const handleClose = () => {
    if (selectedAnime) {
      setSelectedAnime(null);
      return;
    }
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setHashAnime(null);
  };

  let content: React.ReactNode;

  if (error) {
    content = (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
        {error}
      </Alert>
    );
  } else if (loading) {
    content = (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </SimpleGrid>
    );
  } else if (data.length === 0) {
    content = (
      <Center py="xl">
        <Stack align="center" gap="xs">
          <Text size="lg" fw={500} c="dimmed">
            No anime found
          </Text>
          <Text size="sm" c="dimmed">
            Try adjusting your search or filters
          </Text>
        </Stack>
      </Center>
    );
  } else {
    content = (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {data.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} onClick={() => setSelectedAnime(anime)} />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <>
      {content}
      <AnimeDetailModal
        opened={modalOpened}
        anime={modalAnime}
        onClose={handleClose}
      />
    </>
  );
}
