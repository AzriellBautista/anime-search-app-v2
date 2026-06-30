import { forwardRef } from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  size?: 'md' | 'lg';
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange, onSubmit, size = 'lg' }, ref) {
    return (
      <TextInput
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit(value);
        }}
        placeholder="Search anime..."
        size={size}
        radius="xl"
        leftSection={<IconSearch size={18} />}
      />
    );
  },
);
