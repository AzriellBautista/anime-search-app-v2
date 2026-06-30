import { useEffect, useState } from 'react';
import { Modal, Image, Text, Badge, Group, Stack, Anchor, Grid, Divider, ScrollArea, AspectRatio, Tabs } from '@mantine/core';
import type { Anime } from '../types/anime';
import { AnimeCharactersTab } from './AnimeCharactersTab';
import { AnimePicturesTab } from './AnimePicturesTab';
import { AnimeStatisticsTab } from './AnimeStatisticsTab';
import { AnimeRelationsTab } from './AnimeRelationsTab';
import { AnimeRecommendationsTab } from './AnimeRecommendationsTab';

interface AnimeDetailModalProps {
  opened: boolean;
  anime: Anime | null;
  onClose: () => void;
}

function seasonLabel(season?: string): string {
  if (!season) return '';
  return season.charAt(0).toUpperCase() + season.slice(1);
}

function airedLabel(aired: Anime['aired']): string {
  const from = aired.from ? new Date(aired.from).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '?';
  const to = aired.to ? new Date(aired.to).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '?';
  return `${from} to ${to}`;
}

export function AnimeDetailModal({ opened, anime, onClose }: AnimeDetailModalProps) {
  const [charactersOpened, setCharactersOpened] = useState(false);
  const [picturesOpened, setPicturesOpened] = useState(false);
  const [statisticsOpened, setStatisticsOpened] = useState(false);
  const [relationsOpened, setRelationsOpened] = useState(false);
  const [recommendationsOpened, setRecommendationsOpened] = useState(false);

  useEffect(() => {
    setCharactersOpened(false);
    setPicturesOpened(false);
    setStatisticsOpened(false);
    setRelationsOpened(false);
    setRecommendationsOpened(false);
  }, [anime?.mal_id]);

  if (!anime) return null;

  const imageUrl = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const hasTrailer = anime.trailer?.url;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Image
            src={anime.images?.jpg?.small_image_url}
            alt={anime.title}
            w={30}
            h={30}
            radius="sm"
            fit="cover"
          />
          <Text>{anime.title_english || anime.title}</Text>
        </Group>
      }
      size="calc(100vw - 2rem)"
      scrollAreaComponent={ScrollArea.Autosize}
      styles={{ body: { padding: 0 } }}
    >
      <Grid m={0} gap={0}>
        <Grid.Col span={{ base: 12, sm: 4 }} p="md" style={{ backgroundColor: 'var(--mantine-color-default-hover)' }}>
          <AspectRatio ratio={3 / 4} maw={350} mx="auto">
            <Image src={imageUrl} alt={anime.title} radius="md" />
          </AspectRatio>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 8 }} p="md">
          <Stack gap="xs">
            <Text size="xl" fw={700}>{anime.title_english || anime.title}</Text>
            {anime.title_japanese && <Text size="sm" c="dimmed">{anime.title_japanese}</Text>}
            {anime.title !== anime.title_english && anime.title !== anime.title_japanese && (
              <Text size="xs" c="dimmed">{anime.title}</Text>
            )}

            <Group gap="xs" mt="xs">
              {anime.score && (
                <Stack gap={2} align="center">
                  <Text size="xs" c="dimmed">Score</Text>
                  <Badge color="yellow" variant="light" size="lg">★ {anime.score}</Badge>
                </Stack>
              )}
              {anime.rank && (
                <Stack gap={2} align="center">
                  <Text size="xs" c="dimmed">Rank</Text>
                  <Badge color="red" variant="light" size="lg">#{anime.rank}</Badge>
                </Stack>
              )}
              {anime.popularity && (
                <Stack gap={2} align="center">
                  <Text size="xs" c="dimmed">Popularity</Text>
                  <Badge color="blue" variant="light" size="lg">#{anime.popularity}</Badge>
                </Stack>
              )}
              {anime.members != null && (
                <Stack gap={2} align="center">
                  <Text size="xs" c="dimmed">Members</Text>
                  <Badge color="teal" variant="light" size="lg">{anime.members.toLocaleString()}</Badge>
                </Stack>
              )}
              {anime.favorites != null && (
                <Stack gap={2} align="center">
                  <Text size="xs" c="dimmed">Favorites</Text>
                  <Badge color="grape" variant="light" size="lg">{anime.favorites.toLocaleString()}</Badge>
                </Stack>
              )}
            </Group>

            <Divider my="xs" />

            <Grid>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Type</Text>
                <Text size="sm">{anime.type || 'N/A'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Episodes</Text>
                <Text size="sm">{anime.episodes ?? 'N/A'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Status</Text>
                <Text size="sm">{anime.status || 'N/A'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Duration</Text>
                <Text size="sm">{anime.duration || 'N/A'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Rating</Text>
                <Text size="sm">{anime.rating || 'N/A'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Source</Text>
                <Text size="sm">{anime.source || 'N/A'}</Text>
              </Grid.Col>
              {anime.season && (
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed">Season</Text>
                  <Text size="sm">{seasonLabel(anime.season)} {anime.year || ''}</Text>
                </Grid.Col>
              )}
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Aired</Text>
                <Text size="sm">{airedLabel(anime.aired)}</Text>
              </Grid.Col>
            </Grid>

            <Divider my="xs" />

            {anime.genres && anime.genres.length > 0 && (
              <Group gap={4}>
                {anime.genres.map((g) => <Badge key={g.mal_id} size="sm" variant="light">{g.name}</Badge>)}
                {anime.themes?.map((t) => <Badge key={t.mal_id} size="sm" variant="outline">{t.name}</Badge>)}
                {anime.demographics?.map((d) => <Badge key={d.mal_id} size="sm" color="violet" variant="light">{d.name}</Badge>)}
              </Group>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Tabs defaultValue="details" onChange={(value) => { if (value === 'characters') setCharactersOpened(true); if (value === 'pictures') setPicturesOpened(true); if (value === 'statistics') setStatisticsOpened(true); if (value === 'relations') setRelationsOpened(true); if (value === 'recommendations') setRecommendationsOpened(true); }} px="md" pb="md">
        <Tabs.List>
          <Tabs.Tab value="details">Details</Tabs.Tab>
          <Tabs.Tab value="characters">Characters</Tabs.Tab>
          <Tabs.Tab value="pictures">Pictures</Tabs.Tab>
          <Tabs.Tab value="statistics">Statistics</Tabs.Tab>
          <Tabs.Tab value="relations">Relations</Tabs.Tab>
          <Tabs.Tab value="recommendations">Recommendations</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="details" pt="md">
          <Stack gap="md">
            <div>
              <Text fw={600} size="sm" mb={4}>Synopsis</Text>
              <Text size="sm">{anime.synopsis || 'No synopsis available.'}</Text>
            </div>

            {anime.background && (
              <div>
                <Text fw={600} size="sm" mb={4}>Background</Text>
                <Text size="sm">{anime.background}</Text>
              </div>
            )}

            <Divider />

            <Group gap="xl">
              {anime.studios && anime.studios.length > 0 && (
                <div>
                  <Text size="xs" c="dimmed" mb={2}>Studios</Text>
                  <Text size="sm">{anime.studios.map((s) => s.name).join(', ')}</Text>
                </div>
              )}
              {anime.producers && anime.producers.length > 0 && anime.producers[0].mal_id !== 0 && (
                <div>
                  <Text size="xs" c="dimmed" mb={2}>Producers</Text>
                  <Text size="sm">{anime.producers.map((p) => p.name).join(', ')}</Text>
                </div>
              )}
              {anime.licensors && anime.licensors.length > 0 && anime.licensors[0].mal_id !== 0 && (
                <div>
                  <Text size="xs" c="dimmed" mb={2}>Licensors</Text>
                  <Text size="sm">{anime.licensors.map((l) => l.name).join(', ')}</Text>
                </div>
              )}
            </Group>

            <Group gap="xs">
              {anime.url && (
                <Anchor href={anime.url} target="_blank" rel="noopener noreferrer" size="sm">
                  View on MyAnimeList
                </Anchor>
              )}
              {hasTrailer && (
                <Anchor href={anime.trailer.url!} target="_blank" rel="noopener noreferrer" size="sm">
                  ▶ Watch Trailer
                </Anchor>
              )}
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="characters" pt="md">
          {charactersOpened && <AnimeCharactersTab animeId={anime.mal_id} />}
        </Tabs.Panel>

        <Tabs.Panel value="pictures" pt="md">
          {picturesOpened && <AnimePicturesTab animeId={anime.mal_id} />}
        </Tabs.Panel>

        <Tabs.Panel value="statistics" pt="md">
          {statisticsOpened && <AnimeStatisticsTab animeId={anime.mal_id} />}
        </Tabs.Panel>

        <Tabs.Panel value="relations" pt="md">
          {relationsOpened && <AnimeRelationsTab animeId={anime.mal_id} />}
        </Tabs.Panel>

        <Tabs.Panel value="recommendations" pt="md">
          {recommendationsOpened && <AnimeRecommendationsTab animeId={anime.mal_id} />}
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
