import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Box,
} from '@mantine/core';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import type { SearchParams } from '../types/anime';
import { useAnimeSearch } from '../hooks/useAnimeSearch';
import { useSearchParams } from '../hooks/useSearchParams';
import { useGenreList } from '../hooks/useGenreList';
import { SearchBar } from '../components/SearchBar';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { AnimeGrid } from '../components/AnimeGrid';
import { PaginationBar, PageInput } from '../components/PaginationBar';
import { BackToTop } from '../components/BackToTop';
import { ActiveFilterPills } from '../components/ActiveFilterPills';

export function SearchPage({ homeCount }: { homeCount: number }) {
  const animeSearch = useAnimeSearch();
  const { data, pagination, loading, error, hasSearched, params, searchVersion, search, setPage, reset } = animeSearch;
  useSearchParams(animeSearch);
  const { genres } = useGenreList();
  const [filtersOpened, setFiltersOpened] = useState(false);
  const [draftFilters, setDraftFilters] = useState<SearchParams>({});
  const [query, setQuery] = useState('');

  const isInitial = !hasSearched;

  const commitSearch = (searchQuery?: string) => {
    const merged: SearchParams = { ...draftFilters, page: 1, limit: 25 };
    const q = searchQuery !== undefined ? searchQuery : query;
    if (q.trim()) merged.q = q.trim();
    search(merged);
  };

  const handleSetDraftFilters = (partial: Partial<SearchParams>) => {
    setDraftFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleReset = () => {
    setDraftFilters({});
    if (query.trim()) {
      search({ q: query.trim(), page: 1, limit: 25 });
    }
  };

  const handleRemoveFilter = (key: keyof SearchParams, value?: string) => {
    if (key === 'q') {
      setQuery('');
      const merged: SearchParams = { ...draftFilters, page: 1, limit: 25 };
      search(merged);
      return;
    }
    setDraftFilters((prev) => {
      if (value && (key === 'genres' || key === 'genres_exclude' || key === 'producers')) {
        const current = prev[key] as string | undefined;
        if (!current) return prev;
        const items = current.split(',').filter((v) => v !== value);
        const next = { ...prev, [key]: items.length ? items.join(',') : undefined };
        const merged: SearchParams = { ...next, page: 1, limit: 25 };
        if (query.trim()) merged.q = query.trim();
        search(merged);
        return next;
      }
      const next = { ...prev };
      delete next[key];
      const merged: SearchParams = { ...next, page: 1, limit: 25 };
      if (query.trim()) merged.q = query.trim();
      search(merged);
      return next;
    });
  };

  // Sync query + draftFilters from committed params (only on new search, not page change)
  const prevSearchVersion = useRef(0);
  useEffect(() => {
    if (!hasSearched || searchVersion === 0) return;
    if (searchVersion === prevSearchVersion.current) return;
    prevSearchVersion.current = searchVersion;
    const { q, page: _p, limit: _l, ...filterFields } = params;
    if (q !== undefined) setQuery(q);
    setDraftFilters(filterFields);
  }, [searchVersion, hasSearched]);

  // Home button resets to initial state
  useEffect(() => {
    reset();
    setQuery('');
    setDraftFilters({});
    setFiltersOpened(false);
  }, [homeCount]);

  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K to focus search bar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Scroll to top on page change or new search
  const prevScrollKey = useRef('');
  useEffect(() => {
    if (!hasSearched) return;
    const key = JSON.stringify(params);
    if (key === prevScrollKey.current) return;
    prevScrollKey.current = key;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [params, hasSearched]);

  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isInitial ? 'center' : undefined,
        overflow: 'auto',
      }}
    >
      <Container size="xl" py={isInitial ? 0 : 'md'}>

        <Stack align="center" gap="lg" style={{ width: '100%' }}>
          {isInitial && (
            <>
              <Title order={1} ta="center" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Anime Search
              </Title>
              <Text c="dimmed" ta="center" size="lg" maw={500}>
                Discover anime from MyAnimeList — search by title, filter by genre,
                rating, and more.
              </Text>
            </>
          )}

          {/* Search bar + Filters toggle — always visible */}
          <Group gap="xs" mb="xs" justify="center" wrap="nowrap">
            <Box style={{ width: 'min(400px, 60vw)' }}>
              <SearchBar
                ref={searchRef}
                value={query}
                onChange={setQuery}
                onSubmit={(q) => commitSearch(q)}
                size={isInitial ? 'lg' : 'md'}
              />
            </Box>
            <Button
              hiddenFrom="sm"
              variant={filtersOpened ? 'filled' : 'light'}
              size={isInitial ? 'lg' : 'md'}
              px="xs"
              onClick={() => setFiltersOpened((o) => !o)}
            >
              <IconFilter size={16} />
            </Button>
            <Button
              visibleFrom="sm"
              variant={filtersOpened ? 'filled' : 'light'}
              size={isInitial ? 'lg' : 'md'}
              leftSection={<IconFilter size={16} />}
              onClick={() => setFiltersOpened((o) => !o)}
            >
              Filters
            </Button>
            <Button
              hiddenFrom="sm"
              variant="light"
              size={isInitial ? 'lg' : 'md'}
              px="xs"
              onClick={() => commitSearch()}
            >
              <IconSearch size={16} />
            </Button>
            <Button
              visibleFrom="sm"
              variant="light"
              size={isInitial ? 'lg' : 'md'}
              leftSection={<IconSearch size={16} />}
              onClick={() => commitSearch()}
            >
              Search
            </Button>
          </Group>

          {/* Filters panel — always visible (collapsed by default) */}
          <AdvancedFilters
            opened={filtersOpened}
            genres={genres}
            filters={draftFilters}
            onSetFilters={handleSetDraftFilters}
            onApply={() => commitSearch()}
            onReset={handleReset}
          />

          {hasSearched && (
            <ActiveFilterPills
              params={params}
              genres={genres}
              onRemove={handleRemoveFilter}
            />
          )}

          {!isInitial && hasSearched && !loading && !error && data.length > 0 && (
            <Group justify="center" align="center" w="100%" gap={6}>
              <Text size="sm">
                Found {pagination?.items?.total ?? data.length} result{pagination?.items?.total !== 1 ? 's' : ''}
              </Text>
              <Text size="sm">·</Text>
              <PageInput pagination={pagination} onPageChange={setPage} />
            </Group>
          )}
        </Stack>

        {/* Results */}
        {!isInitial && (
          <>
            <Box mt="md">
              <AnimeGrid data={data} loading={loading} error={error} />
            </Box>
            <PaginationBar pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </Container>
      <BackToTop />
    </Box>
  );
}
