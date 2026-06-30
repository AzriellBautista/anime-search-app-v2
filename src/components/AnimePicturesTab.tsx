import { useEffect, useRef, useState } from 'react';
import { SimpleGrid, Image, AspectRatio, Skeleton, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchAnimePictures } from '../services/jikan';
import type { AnimeImages } from '../types/anime';

interface AnimePicturesTabProps {
  animeId: number;
}

export function AnimePicturesTab({ animeId }: AnimePicturesTabProps) {
  const [data, setData] = useState<AnimeImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnimePictures(animeId)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setLoading(false);
          loadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load pictures');
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
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md" py="md">
        {Array.from({ length: 8 }).map((_, i) => (
          <AspectRatio key={i} ratio={3 / 4}>
            <Skeleton radius="sm" />
          </AspectRatio>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md" py="md">
      {data.map((pic, i) => {
        const src = pic.webp?.large_image_url || pic.jpg.large_image_url;
        return (
          <AspectRatio key={i} ratio={3 / 4}>
            <Image src={src} alt={`Picture ${i + 1}`} radius="sm" />
          </AspectRatio>
        );
      })}
    </SimpleGrid>
  );
}
