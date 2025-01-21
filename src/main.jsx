import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { GlobalDataProvider } from "./context/GlobalDataContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { showErrorToast } from "./services/toastService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        showErrorToast(error);
      },
    },
    mutations: {
      onError: (error) => {
        showErrorToast(error);
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalDataProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </GlobalDataProvider>
    </QueryClientProvider>
  </StrictMode>
);
