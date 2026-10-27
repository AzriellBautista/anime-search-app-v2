import { useEffect, useRef, useState } from 'react';
import { Stack, Text, Badge, Group, Alert, Skeleton, Card, Anchor, Pagination, Divider, Image, Button } from '@mantine/core';
import { IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react';
import { fetchAnimeEpisodes } from '../services/tenrai';
import type { AnimeEpisode } from '../types/anime';

interface AnimeEpisodesTabProps {
  animeId: number;
}

function episodeNumber(ep: AnimeEpisode, index: number, page: number): string {
  const m = ep.url?.match(/\/episode\/(\d+)/);
  if (m) return m[1];
  return String((page - 1) * 25 + index + 1);
}

function durationLabel(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function AnimeEpisodesTab({ animeId }: AnimeEpisodesTabProps) {
  const [data, setData] = useState<AnimeEpisode[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideFillers, setHideFillers] = useState(false);
  const [hideRecaps, setHideRecaps] = useState(false);
  const loadedRef = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnimeEpisodes(animeId, 1)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setPage(res.pagination?.current_page ?? 1);
          setTotalPages(res.pagination?.last_visible_page ?? 1);
          setLoading(false);
          loadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load episodes');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [animeId]);

  const loadPage = (p: number) => {
    setLoading(true);
    fetchAnimeEpisodes(animeId, p)
      .then((res) => {
        setData(res.data);
        setPage(res.pagination?.current_page ?? p);
        setTotalPages(res.pagination?.last_visible_page ?? totalPages);
        setLoading(false);
        scrollToTop();
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load episodes');
        setLoading(false);
      });
  };

  type RenderItem =
    | { kind: 'skip'; count: number }
    | { kind: 'ep'; ep: AnimeEpisode; originalIndex: number };

  const renderItems: RenderItem[] = [];
  let skippedRun = 0;
  data.forEach((ep, originalIndex) => {
    const hidden = (hideFillers && !!ep.filler) || (hideRecaps && !!ep.recap);
    if (hidden) {
      skippedRun += 1;
    } else {
      if (skippedRun > 0) {
        renderItems.push({ kind: 'skip', count: skippedRun });
        skippedRun = 0;
      }
      renderItems.push({ kind: 'ep', ep, originalIndex });
    }
  });
  if (skippedRun > 0) {
    renderItems.push({ kind: 'skip', count: skippedRun });
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
        {error}
      </Alert>
    );
  }

  if (loading && data.length === 0) {
    return (
      <Stack py="md" gap="md">
        <Group gap="xs" justify="center">
          <Button
            size="xs"
            variant={hideFillers ? 'filled' : 'light'}
            color="blue"
            leftSection={hideFillers ? <IconEyeOff size={14} /> : <IconEye size={14} />}
            onClick={() => setHideFillers((v) => !v)}
          >
            Fillers
          </Button>
          <Button
            size="xs"
            variant={hideRecaps ? 'filled' : 'light'}
            color="blue"
            leftSection={hideRecaps ? <IconEyeOff size={14} /> : <IconEye size={14} />}
            onClick={() => setHideRecaps((v) => !v)}
          >
            Recaps
          </Button>
        </Group>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} shadow="sm" radius="md" withBorder p="md">
            <Skeleton height={18} width="40%" mb={6} />
            <Skeleton height={14} width="25%" mb={8} />
            <Skeleton height={12} mb={4} />
            <Skeleton height={12} width="85%" mb={4} />
            <Skeleton height={12} width="60%" />
          </Card>
        ))}
      </Stack>
    );
  }

  if (data.length === 0) {
    return (
      <Text c="dimmed" size="sm" py="md">
        No episodes found.
      </Text>
    );
  }

  return (
    <Stack py={0} gap="md">
      <div ref={topRef} />
      <Group gap="xs" justify="center">
        <Button
          size="xs"
          variant={hideFillers ? 'filled' : 'light'}
          color="blue"
          leftSection={hideFillers ? <IconEyeOff size={14} /> : <IconEye size={14} />}
          onClick={() => setHideFillers((v) => !v)}
        >
          Fillers
        </Button>
        <Button
          size="xs"
          variant={hideRecaps ? 'filled' : 'light'}
          color="blue"
          leftSection={hideRecaps ? <IconEyeOff size={14} /> : <IconEye size={14} />}
          onClick={() => setHideRecaps((v) => !v)}
        >
          Recaps
        </Button>
      </Group>

      {renderItems.map((item, i) => {
        if (item.kind === 'skip') {
          return (
            <Divider
              key={`skip-${i}`}
              label={`Skipped ${item.count} episode${item.count !== 1 ? 's' : ''}`}
              labelPosition="center"
              my="xs"
            />
          );
        }
        const { ep, originalIndex } = item;
        return (
        <Card key={`${ep.url}-${originalIndex}`} shadow="sm" radius="md" withBorder p="md">
          <Group align="flex-start" gap="md" mb={4} wrap="nowrap">
            {ep.images?.jpg?.image_url && (
              <Image
                src={ep.images.jpg.image_url}
                alt={ep.title}
                w={120}
                h={68}
                fit="cover"
                radius="sm"
                style={{ flexShrink: 0 }}
              />
            )}
            <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
              <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
                <Badge color="cyan" variant="light" size="sm" style={{ flexShrink: 0 }}>
                  Ep {episodeNumber(ep, originalIndex, page)}
                </Badge>
                {ep.score != null && (
                  <Badge color="yellow" variant="light" size="sm" style={{ flexShrink: 0 }}>
                    ★ {ep.score.toFixed(2)}
                  </Badge>
                )}
              </Group>

              <Text fw={600} size="sm" lineClamp={2}>
                {ep.title}
              </Text>

              {ep.title_japanese && (
                <Text size="xs" c="dimmed">
                  {ep.title_japanese}
                </Text>
              )}

              <Group gap="xs">
                {ep.aired && (
                  <Badge size="xs" variant="light" color="gray">
                    {new Date(ep.aired).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Badge>
                )}
                {durationLabel(ep.duration) && (
                  <Badge size="xs" variant="light" color="gray">
                    {durationLabel(ep.duration)}
                  </Badge>
                )}
                {ep.filler && (
                  <Badge size="xs" color="orange" variant="light">
                    Filler
                  </Badge>
                )}
                {ep.recap && (
                  <Badge size="xs" color="violet" variant="light">
                    Recap
                  </Badge>
                )}
              </Group>

              {ep.synopsis && (
                <Text size="sm">
                  {ep.synopsis}
                </Text>
              )}

              {ep.url && (
                <Anchor href={ep.url} target="_blank" rel="noopener noreferrer" size="xs" style={{ width: 'fit-content' }}>
                  View on MyAnimeList
                </Anchor>
              )}
            </Stack>
          </Group>
        </Card>
        );
      })}
      {totalPages > 1 && (
        <>
          <Divider my="sm" />
          <Group justify="center">
            <Pagination
              total={totalPages}
              value={page}
              onChange={(p) => loadPage(p)}
              size="sm"
            />
          </Group>
        </>
      )}
    </Stack>
  );
}
