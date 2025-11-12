import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { animate } from 'animejs';
import GlassSurface from "./GlassSurface";

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      animate( // <-- New v4 function
        navRef.current, // <-- Target is the first argument
        { // <-- Properties are the second argument
          scale: scrolled ? 0.95 : 1,
          duration: 400,
          easing: "easeOutExpo",
        }
      );
    }
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to the top of the page when the location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const links = [
    { path: "/", label: "Beranda" },
    { path: "/how-to-report", label: "Cara Melapor" },
    { path: "/stories", label: "Kisah Korban" },
    { path: "/submit-story", label: "Bagikan Kisah" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      ref={navRef}
      className={`sticky z-50 transition-all duration-300 ${
        (scrolled || mobileMenuOpen)
          ? 'top-3 my-2 mx-auto w-[min(100%_-_1rem,1100px)] rounded-3xl bg-white/80 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.25),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))] backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 supports-[backdrop-filter]:bg-white/70'
          : 'top-0 w-full'
      }`}
    >
      <div className={`${scrolled ? 'px-3 sm:px-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        <div className={`flex justify-between ${scrolled ? 'h-14 sm:h-16' : 'h-16'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div
                className={`p-2 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110 ${
                  scrolled ? "shadow-blue-500/20" : ""
                }`}
              >
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RuangAman
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 ${mobileMenuOpen ? 'pt-3 pb-4' : 'pt-0 pb-0'} space-y-2 transition-[padding] duration-500`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg '
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}