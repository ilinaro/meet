import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { App } from "./App";
import store from "./store";
import "@mantine/core/styles.css";
import "./assets/global.scss";
import { MantineProvider } from "@mantine/core";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MantineProvider>
          <BrowserRouter>
            <App />
            <Toaster position="top-center" reverseOrder={false} />
          </BrowserRouter>
        </MantineProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
