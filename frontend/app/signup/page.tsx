"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Import the API and Auth Hook
import { authApi } from "@/app/api/auth";
import { useAuth } from "@/app/hooks/useAuth";

const SignUp = () => {
  const router = useRouter();
  // Get the register function from the auth hook
  const { register } = useAuth();

  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // States for displaying messages to the user
  const [error, setError] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState("");

  // --- UPDATED FUNCTION ---
  // This function now calls the backend API to send the OTP email.
  const handleSendOtp = async () => {
    if (!email) {
      setOtpMessage("Please enter your email address first.");
      return;
    }
    setSendingOtp(true);
    setOtpMessage(""); // Clear previous messages
    try {
      await authApi.sendOtp(email);
      setOtpMessage("OTP has been sent to your email!");
    } catch (err) {
      setOtpMessage(
        "Failed to send OTP. Please check the email and try again.",
      );
      console.error(err);
    } finally {
      setSendingOtp(false);
    }
  };

  // --- UPDATED FUNCTION ---
  // This function now calls the register function from the auth hook.
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await register({ email, password, otp });

      if (response.success) {
        router.push("/dashboard"); // Redirect to dashboard on successful registration
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <Card className="w-full max-w-md p-8 from-transparent to-gray-50/20">
        <CardBody>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-default-500 mt-1">
              Join us today and get started
            </p>
          </div>

          {/* This block now displays the main registration error */}
          {error && (
            <div className="mb-4 p-3 text-sm text-danger text-center bg-danger-50 rounded-medium">
              {error}
            </div>
          )}

          {/* This block now displays feedback for the OTP action */}
          {otpMessage && (
            <div className="mb-4 p-3 text-sm text-center bg-secondary rounded-medium">
              {otpMessage}
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
                type="button" // Important: change to type="button" to prevent form submission
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
    </section>
  );
};

export default SignUp;
