// Mock useColorScheme for components that depend on theme
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));
