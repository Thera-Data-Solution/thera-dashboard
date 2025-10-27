import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { DefaultRouter } from "./router";


export default function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={DefaultRouter} />
    </>
  );
}
