import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import FrontPage from './src/FrontPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FrontPage />
    </QueryClientProvider>
  );
}
