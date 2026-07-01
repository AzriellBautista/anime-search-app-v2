import { Group, Badge, Text } from '@mantine/core';
import { IconStarFilled, IconX } from '@tabler/icons-react';
import type { SavedSearch, SearchParams } from '../types/anime';

interface SavedSearchPillsProps {
  savedSearches: SavedSearch[];
  onApply: (params: SearchParams) => void;
  onDelete: (id: string) => void;
}

export function SavedSearchPills({ savedSearches, onApply, onDelete }: SavedSearchPillsProps) {
  if (savedSearches.length === 0) return null;

  return (
    <Group gap={6} justify="center" mt="xs">
      <Text size="sm" c="dimmed">Saved searches:</Text>
      {savedSearches.map((s) => (
        <Badge
          key={s.id}
          variant="light"
          size="sm"
          style={{ cursor: 'pointer' }}
          onClick={() => onApply(s.params)}
          leftSection={<IconStarFilled size={12} />}
          rightSection={
            <IconX
              size={12}
              style={{ cursor: 'pointer', display: 'block' }}
              onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
            />
          }
        >
          {s.name.toUpperCase()}
        </Badge>
      ))}
    </Group>
  );
}
