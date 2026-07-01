import { Group, Badge } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { Genre, SearchParams } from '../types/anime';
import { ORDER_BY_OPTIONS, SORT_OPTIONS } from '../constants/filterOptions';

interface ActiveFilterPillsProps {
  params: SearchParams;
  genres: Genre[];
  onRemove: (key: keyof SearchParams, value?: string) => void;
}

const fieldLabels: Record<string, string> = {
  q: 'Search',
  type: 'Type',
  status: 'Status',
  rating: 'Rating',
  genres: 'Genre',
  genres_exclude: 'Exclude Genre',
  min_score: 'Min Score',
  max_score: 'Max Score',
  order_by: 'Order By',
  sort: 'Sort',
  start_date: 'Start Date',
  end_date: 'End Date',
  sfw: 'SFW',
  letter: 'Letter',
  producers: 'Producer',
  unapproved: 'Unapproved',
};

const multiValueFields = new Set(['genres', 'genres_exclude', 'producers']);

const skipFields = new Set(['q', 'page', 'limit']);

const optionLabels: Record<string, Record<string, string>> = {
  order_by: Object.fromEntries(ORDER_BY_OPTIONS.map((o) => [o.value, o.label])),
  sort: Object.fromEntries(SORT_OPTIONS.map((o) => [o.value, o.label])),
};

function formatValue(key: string, value: string, genres: Genre[]): string {
  if ((key === 'genres' || key === 'genres_exclude') && genres.length > 0) {
    const genre = genres.find((g) => String(g.mal_id) === value);
    if (genre) return genre.name;
  }
  if (key === 'sfw' || key === 'unapproved') return 'On';
  if (optionLabels[key]?.[value]) return optionLabels[key][value];
  return value;
}

function renderPill(
  key: string,
  value: string,
  display: string,
  onRemove: (key: keyof SearchParams, value?: string) => void,
) {
  return (
    <Badge
      key={`${key}-${value}`}
      variant="light"
      size="sm"
      rightSection={
        <IconX
          size={12}
          style={{ cursor: 'pointer', display: 'block' }}
          onClick={() => onRemove(key as keyof SearchParams, value)}
        />
      }
    >
      {display}
    </Badge>
  );
}

export function ActiveFilterPills({ params, genres, onRemove }: ActiveFilterPillsProps) {
  const filterPills: { key: string; value: string; display: string }[] = [];

  for (const [key, raw] of Object.entries(params)) {
    if (skipFields.has(key)) continue;
    if (raw === undefined || raw === null || raw === '') continue;
    if (raw === false) continue;

    const label = fieldLabels[key] || key;
    const strValue = String(raw);

    if (multiValueFields.has(key)) {
      const items = strValue.split(',').filter(Boolean);
      for (const item of items) {
        filterPills.push({
          key,
          value: item,
          display: `${label}: ${formatValue(key, item, genres)}`,
        });
      }
    } else {
      filterPills.push({
        key,
        value: strValue,
        display: `${label}: ${formatValue(key, strValue, genres)}`,
      });
    }
  }

  if (filterPills.length === 0) return null;

  const qPill = params.q ? renderPill('q', params.q, `Search: ${params.q}`, onRemove) : null;

  return (
    <Group gap={6} justify="center" mt="xs">
      {qPill}
      {filterPills.map((pill) => renderPill(pill.key, pill.value, pill.display, onRemove))}
    </Group>
  );
}
