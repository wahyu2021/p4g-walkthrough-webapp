import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { ProgressProvider } from './context/ProgressContext.tsx'
import { UiProvider } from './context/UiContext.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProgressProvider>
          <UiProvider>
            <App />
          </UiProvider>
        </ProgressProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
