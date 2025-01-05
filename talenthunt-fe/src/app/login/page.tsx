"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStore from "../stores/store";
import Link from "next/link";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn } = useStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I",
          },
          body: JSON.stringify({
            requestType: "login",
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      localStorage.setItem("authtoken", data.token);
      setIsLoggedIn(true);
      console.log("Login successful:", data);
      router.push("/dashboard");
      // Handle successful login (e.g., redirect, store token, etc.)
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Logo and Branding Section */}
          <div className="w-full max-w-md text-center lg:w-1/2 lg:pr-8">
            <div className=" mx-auto w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <Image
                src="/Image.png"
                alt="Logo"
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
            <h2 className="mt-6 text-3xl md:text-4xl text-gray-900 font-extrabold font-mono">
              Wolf-Pack
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600">
              AI-Powered Candidate Assessment Platform
            </p>
          </div>

          {/* Login Form Section */}
          <div className="w-full max-w-md lg:w-1/2">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-center text-2xl md:text-3xl text-gray-900">
                  Sign In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSignIn}
                  className="space-y-4 md:space-y-6"
                >
                  <div>
                    <Label htmlFor="username" className="text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-2 border-gray-300 focus:border-primary"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 border-gray-300 focus:border-primary"
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-base md:text-lg font-bold hover:bg-primary-dark transition-colors duration-300 shadow-md"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                {error && (
                  <div className="mt-4 text-red-600 text-center">{error}</div>
                )}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">
                    New to Wolfpack?
                    <Link
                      href="https://forms.gle/sTeXKu4U6TAzk5bKA"
                      className="text-primary font-bold hover:underline ml-2"
                    >
                      Get Early Acess
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 md:py-8 w-full">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-gray-700 font-medium">
            © 2024 Wolf-Pack. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
