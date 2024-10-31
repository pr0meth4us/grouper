"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSendOtp = async () => {
    setSendingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSendingOtp(false);
  };

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-content1 to-background p-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-default-500 mt-1">
              Join us today and get started
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-danger text-center bg-danger-50 rounded-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignUp}>
            <Input
              required
              label="Email"
              placeholder="Enter your email"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              type="email"
              value={email}
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              required
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
              label="Password"
              placeholder="Create a password"
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              type={isVisible ? "text" : "password"}
              value={password}
              variant="bordered"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-2">
              <Input
                required
                className="flex-1"
                label="OTP"
                placeholder="Enter OTP"
                type="text"
                value={otp}
                variant="bordered"
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                className="h-[56px] min-w-[120px]"
                color="secondary"
                isDisabled={!email || sendingOtp}
                isLoading={sendingOtp}
                onClick={handleSendOtp}
              >
                Get OTP
              </Button>
            </div>

            <Button
              className="w-full"
              color="primary"
              isDisabled={loading}
              isLoading={loading}
              size="lg"
              type="submit"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <span className="flex items-center justify-center">
                  Sign Up
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>

            <div className="text-center text-sm text-default-500">
              Already have an account?{" "}
              <Link color="secondary" href="/login">
                Log in
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUp;
