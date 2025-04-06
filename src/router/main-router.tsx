import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/layout/admin-layout";
import HomeAdmin from "../pages/home";
import ProductPage from "../pages/product";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "", element: <HomeAdmin /> },
      { path: "/product", element: <ProductPage /> },
    ],
  },
]);

export default router;
