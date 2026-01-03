import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, ThemeToggle } from "./components";
import { Home, Login, Register, Account } from "./pages";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <ThemeToggle />
    </Router>
  );
}

export default App;
