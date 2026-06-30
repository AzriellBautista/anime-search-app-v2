import { useMantineColorScheme, useMantineTheme } from '@mantine/core';

export function useMantineThemeSettings() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const setPrimaryColor = (_color: string) => {
    // Mantine v9 doesn't have a built-in way to change primary color at runtime.
    // This is a placeholder for future enhancement.
  };

  return { colorScheme, toggleColorScheme, primaryColor: theme.primaryColor, setPrimaryColor };
}
