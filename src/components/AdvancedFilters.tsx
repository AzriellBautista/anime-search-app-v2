import {
  Collapse,
  Group,
  Stack,
  Select,
  MultiSelect,
  Switch,
  Button,
  Grid,
  RangeSlider,
  Input,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { IconSearch, IconRefresh } from '@tabler/icons-react';
import type { Genre, SearchParams } from '../types/anime';
import {
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  RATING_OPTIONS,
  ORDER_BY_OPTIONS,
  SORT_OPTIONS,
} from '../constants/filterOptions';

interface AdvancedFiltersProps {
  opened: boolean;
  genres: Genre[];
  filters: SearchParams;
  onSetFilters: (filters: Partial<SearchParams>) => void;
  onApply: () => void;
  onReset: () => void;
}

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
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
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
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            <Stack gap={4}>
              <Input.Label>Score Range</Input.Label>
              <RangeSlider
                min={0}
                max={10}
                step={0.1}
                precision={1}
                value={[filters.min_score ?? 0, filters.max_score ?? 10]}
                onChange={([min, max]) => onSetFilters({ min_score: min > 0 ? min : undefined, max_score: max < 10 ? max : undefined })}
                label={(val) => val.toFixed(1)}
                showLabelOnHover={false}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2.5, label: '2.5' },
                  { value: 5, label: '5' },
                  { value: 7.5, label: '7.5' },
                  { value: 10, label: '10' },
                ]}
                minRange={0.1}
              />
            </Stack>
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
              maxDate={filters.end_date ? dayjs(filters.end_date).toDate() : undefined}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <DatePickerInput
              label="End Date"
              placeholder="To"
              clearable
              value={filters.end_date || null}
              onChange={(v) => onSetFilters({ end_date: v || undefined })}
              minDate={filters.start_date ? dayjs(filters.start_date).toDate() : undefined}
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
