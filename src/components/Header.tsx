import { Group, Title, ActionIcon, Tooltip, Container } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useMantineThemeSettings } from '../hooks/useMantineTheme';

interface HeaderProps {
  onHome?: () => void;
}

export function Header({ onHome }: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineThemeSettings();

  return (
    <header style={{ backgroundColor: 'var(--mantine-primary-color-filled)' }}>
      <Container size="xl">
        <Group justify="space-between" py="sm">
          <Title order={4} c="var(--mantine-primary-color-contrast)" style={{ cursor: 'pointer' }} onClick={onHome}>Anime Search</Title>
          <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}>
            <ActionIcon variant="subtle" onClick={toggleColorScheme} size="lg" color="var(--mantine-primary-color-contrast)">
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Container>
    </header>
  );
}
