"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginData: LoginFormData = {
        email,
        password,
      };

      const response = await login(loginData);

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <Card className="w-full max-w-md p-8 from-transparent to-gray-50/20">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-danger text-center bg-danger/10 rounded-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            fullWidth
            required
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={loading}
            autoComplete="email"
          />
          <Input
            fullWidth
            required
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={loading}
            autoComplete="current-password"
          />
          <Button
            fullWidth
            color="primary"
            disabled={loading}
            isLoading={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              className="text-primary cursor-pointer"
              href="/signup"
              color="primary"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </section>
  );
}