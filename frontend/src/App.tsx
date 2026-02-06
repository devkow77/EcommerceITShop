import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, ThemeToggle } from "./components";
import {
  Home,
  Login,
  Register,
  Account,
  NotFound,
  Forbidden,
  ServerError,
  Admin,
} from "./pages";

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

        {/* Error pages */}
        <Route path="/errors/404" element={<NotFound />} />
        <Route path="/errors/403" element={<Forbidden />} />
        <Route path="/errors/500" element={<ServerError />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ThemeToggle />
    </Router>
  );
}

export default App;
