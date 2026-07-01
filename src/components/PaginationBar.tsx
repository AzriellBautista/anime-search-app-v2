import { useState, useEffect, useCallback } from 'react';
import { Group, ActionIcon, Text, NumberInput, Pagination } from '@mantine/core';
import { IconChevronsLeft, IconChevronLeft, IconChevronRight, IconChevronsRight } from '@tabler/icons-react';
import type { Pagination as PaginationType } from '../types/anime';

interface PaginationBarProps {
  pagination: PaginationType | null;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const [pageInput, setPageInput] = useState<number | string>(pagination?.current_page ?? 1);

  useEffect(() => {
    if (pagination) {
      setPageInput(pagination.current_page);
    }
  }, [pagination?.current_page]);

  const handleSubmit = useCallback((value: number | string) => {
    if (!pagination) return;
    const page = Number(value);
    if (!isNaN(page) && page >= 1 && page <= pagination.last_visible_page && page !== pagination.current_page) {
      onPageChange(page);
    } else {
      setPageInput(pagination.current_page);
    }
  }, [pagination, onPageChange]);

  if (!pagination || pagination.last_visible_page <= 1) return null;

  const { current_page, last_visible_page } = pagination;
  const isFirst = current_page <= 1;
  const isLast = current_page >= last_visible_page;

  return (
    <Group justify="center" mt="xl" gap="xs">
      <Group gap={4} wrap="nowrap">
        <Text size="sm">Page</Text>
        <NumberInput
          value={pageInput}
          onChange={setPageInput}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(pageInput); }}
          min={1}
          max={last_visible_page}
          allowDecimal={false}
          allowNegative={false}
          size="xs"
          enterKeyHint="go"
          style={{ width: 55 }}
          aria-label="Page number"
        />
        <Text size="sm" pr="xs">/ {last_visible_page}</Text>
      </Group>

      {!isFirst && (
        <>
          <ActionIcon variant="subtle" onClick={() => onPageChange(1)}>
            <IconChevronsLeft size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={() => onPageChange(current_page - 1)}>
            <IconChevronLeft size={16} />
          </ActionIcon>
        </>
      )}

      <Pagination
        total={last_visible_page}
        value={current_page}
        onChange={onPageChange}
        withEdges={false}
        withControls={false}
      />

      {!isLast && (
        <>
          <ActionIcon variant="subtle" onClick={() => onPageChange(current_page + 1)}>
            <IconChevronRight size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={() => onPageChange(last_visible_page)}>
            <IconChevronsRight size={16} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
