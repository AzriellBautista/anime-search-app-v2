import { Container, Group, Text, Anchor } from '@mantine/core';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
      <Container size="xl">
        <Group justify="center" py="md">
          <Text size="sm" c="dimmed">
            Powered by{' '}
            <Anchor href="https://jikan.moe" target="_blank" rel="noopener noreferrer" size="sm" c="dimmed">
              Jikan API
            </Anchor>
            {' '}&mdash; Data from MyAnimeList
          </Text>
        </Group>
      </Container>
    </footer>
  );
}
