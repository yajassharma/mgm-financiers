import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md mx-auto h-full bg-white shadow-lg">
          <RouterProvider router={router} />
        </div>
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
