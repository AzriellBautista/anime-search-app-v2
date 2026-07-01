import { useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import { MantineProvider, createTheme, Box } from '@mantine/core';
import { SearchPage } from './pages/SearchPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export default function App() {
  const [homeCount, setHomeCount] = useState(0);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Header onHome={() => setHomeCount(c => c + 1)} />
        <SearchPage homeCount={homeCount} />
        <Footer />
      </Box>
    </MantineProvider>
  );
}
