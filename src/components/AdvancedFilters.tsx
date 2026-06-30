import {
  Collapse,
  Group,
  Stack,
  Select,
  NumberInput,
  MultiSelect,
  Switch,
  Button,
  Grid,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconRefresh } from '@tabler/icons-react';
import type { Genre, SearchParams } from '../types/anime';

interface AdvancedFiltersProps {
  opened: boolean;
  genres: Genre[];
  filters: SearchParams;
  onSetFilters: (filters: Partial<SearchParams>) => void;
  onApply: () => void;
  onReset: () => void;
}

const TYPE_OPTIONS = [
  { value: 'TV', label: 'TV' },
  { value: 'OVA', label: 'OVA' },
  { value: 'Movie', label: 'Movie' },
  { value: 'Special', label: 'Special' },
  { value: 'ONA', label: 'ONA' },
  { value: 'Music', label: 'Music' },
];

const STATUS_OPTIONS = [
  { value: 'airing', label: 'Airing' },
  { value: 'complete', label: 'Complete' },
  { value: 'upcoming', label: 'Upcoming' },
];

const RATING_OPTIONS = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13 - Teens 13+' },
  { value: 'r17', label: 'R - 17+' },
  { value: 'r', label: 'R+ - Mild Nudity' },
  { value: 'rx', label: 'Rx - Hentai' },
];

const ORDER_BY_OPTIONS = [
  { value: 'mal_id', label: 'MAL ID' },
  { value: 'title', label: 'Title' },
  { value: 'start_date', label: 'Start Date' },
  { value: 'end_date', label: 'End Date' },
  { value: 'episodes', label: 'Episodes' },
  { value: 'score', label: 'Score' },
  { value: 'rank', label: 'Rank' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'members', label: 'Members' },
  { value: 'favorites', label: 'Favorites' },
];

const SORT_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export function AdvancedFilters({
  opened,
  genres,
  filters,
  onSetFilters,
  onApply,
  onReset,
}: AdvancedFiltersProps) {
  const genreOptions = genres.map((g) => ({ value: String(g.mal_id), label: g.name }));

  return (
    <Collapse expanded={opened} w="100%" maw={800}>
      <Stack gap="md" p="md" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 'var(--mantine-radius-md)' }}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Type"
              placeholder="Any type"
              data={TYPE_OPTIONS}
              clearable
              searchable
              value={filters.type || null}
              onChange={(v) => onSetFilters({ type: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Status"
              placeholder="Any status"
              data={STATUS_OPTIONS}
              clearable
              searchable
              value={filters.status || null}
              onChange={(v) => onSetFilters({ status: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Rating"
              placeholder="Any rating"
              data={RATING_OPTIONS}
              clearable
              searchable
              value={filters.rating || null}
              onChange={(v) => onSetFilters({ rating: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MultiSelect
              label="Genres"
              placeholder="Select genres"
              data={genreOptions}
              clearable
              searchable
              value={filters.genres ? filters.genres.split(',') : []}
              onChange={(v) => onSetFilters({ genres: v.length ? v.join(',') : undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Min Score"
              placeholder="0"
              min={0}
              max={10}
              decimalScale={1}
              value={filters.min_score ?? ''}
              onChange={(v) => onSetFilters({ min_score: v === '' ? undefined : Number(v) })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Max Score"
              placeholder="10"
              min={0}
              max={10}
              decimalScale={1}
              value={filters.max_score ?? ''}
              onChange={(v) => onSetFilters({ max_score: v === '' ? undefined : Number(v) })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Order By"
              placeholder="Default"
              data={ORDER_BY_OPTIONS}
              clearable
              searchable
              value={filters.order_by || null}
              onChange={(v) => onSetFilters({ order_by: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Sort"
              placeholder="Descending"
              data={SORT_OPTIONS}
              clearable
              searchable
              value={filters.sort || null}
              onChange={(v) => onSetFilters({ sort: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <DatePickerInput
              label="Start Date"
              placeholder="From"
              clearable
              value={filters.start_date || null}
              onChange={(v) => onSetFilters({ start_date: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <DatePickerInput
              label="End Date"
              placeholder="To"
              clearable
              value={filters.end_date || null}
              onChange={(v) => onSetFilters({ end_date: v || undefined })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Switch
              label="SFW Only"
              mt="lg"
              checked={filters.sfw ?? false}
              onChange={(e) => onSetFilters({ sfw: e.currentTarget.checked || undefined })}
            />
          </Grid.Col>
        </Grid>

        <Group justify="center" gap="md">
          <Button leftSection={<IconSearch size={16} />} onClick={onApply}>
            Apply Filters
          </Button>
          <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={onReset}>
            Reset
          </Button>
        </Group>
      </Stack>
    </Collapse>
  );
}
