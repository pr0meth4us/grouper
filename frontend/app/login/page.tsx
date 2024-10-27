"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import { useAuth } from "@/app/providers";
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);

    setLoading(false);
    if (result) {
      router.push("/dashboard");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <Card className="w-full max-w-md p-8 from-transparent to-gray-50/20">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            fullWidth
            required
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            fullWidth
            required
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            color="primary"
            disabled={loading}
            isLoading={loading}
            type="submit"
          >
            Login
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link className="text-primary" href="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </section>
  );
}
