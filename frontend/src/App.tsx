import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Footer, Navbar, ThemeToggle } from "./components";
import {
  Home,
  Login,
  Register,
  Account,
  NotFound,
  Forbidden,
  ServerError,
  Admin,
  AdminProducts,
  AdminCategories,
  AdminUsers,
  AdminOrders,
  CategoryProducts,
  AdminStatistics,
  Product,
} from "./pages";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
        <Route path="/admin/products" element={<AdminProducts />} />

        <Route path="/products/:category" element={<CategoryProducts />} />
        <Route path="/products/:category/:product" element={<Product />} />

        {/* Error pages */}
        <Route path="/errors/404" element={<NotFound />} />
        <Route path="/errors/403" element={<Forbidden />} />
        <Route path="/errors/500" element={<ServerError />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ThemeToggle />
      <Toaster />
      <Footer />
    </Router>
  );
}

export default App;
