import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { useTheme } from "../hooks/useTheme.js";

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
