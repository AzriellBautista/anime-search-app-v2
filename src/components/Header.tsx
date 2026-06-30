import { Group, Title, ActionIcon, Tooltip, Container, Text } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useMantineThemeSettings } from '../hooks/useMantineTheme';

export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineThemeSettings();

  return (
    <header style={{ backgroundColor: 'var(--mantine-primary-color-filled)' }}>
      <Container size="xl">
        <Group justify="space-between" py="sm">
          <Group gap={6}>
            <Text size="xl" fw={700} c="var(--mantine-primary-color-contrast)">A</Text>
            <Title order={4} c="var(--mantine-primary-color-contrast)">Anime Search</Title>
          </Group>
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
