"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useStore from "../stores/store";

const links = [
  { title: "Create Role", link: "/create-role" },
  { title: "Candidates Dashboard", link: "/dashboard" },
];
const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, setIsLoggedIn } = useStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    redirect("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex gap-2 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/wolf-pack-logo.png"
                alt="Logo"
                width={80}
                height={50}
              />
              <h2 className="text-xl text-gray-900 ml-2 font-mono">
                Wolf-Pack
              </h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn &&
              links.map((link) => (
                <Link
                  key={link.link}
                  href={link.link}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    pathname === link.link
                      ? "bg-gray-700 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {link.title}
                </Link>
              ))}

            {isLoggedIn && (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-400 hover:text-white font-bold"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {isLoggedIn && (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-800"
              >
                <Menu className="h-6 w-6" />
              </Button>
            ) : (
              <Button>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn &&
                links.map((link) => (
                  <Link
                    key={link.link}
                    href={link.link}
                    onClick={toggleMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === link.link
                        ? "bg-gray-700 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
