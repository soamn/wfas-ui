"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "../store/auth/auth.types";
import { loginRequest } from "../store/auth/auth.api";
import { useAuthStore } from "../store/auth/auth.store";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Link from "next/link";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const storeAuthData = useAuthStore((s) => s.storeAuthData);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const result = loginSchema.shape.email.safeParse(email);
    if (!email) {
      setEmailError(null);
    } else if (!result.success) {
      setEmailError(result.error.issues[0]?.message || "Invalid email");
    } else {
      setEmailError(null);
    }
  }, [email]);

  useEffect(() => {
    const result = loginSchema.shape.password.safeParse(password);
    if (!password) {
      setPasswordError(null);
    } else if (!result.success) {
      setPasswordError(result.error.issues[0]?.message || "Invalid password");
    } else {
      setPasswordError(null);
    }
  }, [password]);

  useEffect(() => {
    const overallResult = loginSchema.safeParse({ email, password });
    setIsValid(overallResult.success);
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormError(null);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setFormError(null);

    const overallResult = loginSchema.safeParse({ email, password });
    if (!overallResult.success) {
      if (!emailError)
        setEmailError(
          loginSchema.shape.email.safeParse(email).success
            ? null
            : "Invalid email",
        );
      if (!passwordError)
        setPasswordError(
          loginSchema.shape.password.safeParse(password).success
            ? null
            : "Invalid password",
        );
      setFormError("Please correct the errors in the form.");
      return;
    }

    try {
      const res = await loginRequest({ email, password });
      storeAuthData(res.data.user);
      router.push("/");
    } catch (error: any) {
      if (error.response) {
        setFormError(error.response.data.error?.message || "Login failed");
      } else if (error.request) {
        setFormError("Server not responding. Please try again later.");
      } else {
        setFormError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange} // Use new handler
              placeholder="Enter your email"
              error={emailError}
            />
          </div>
          <div>
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange} // Use new handler
              placeholder="Enter your password"
              error={passwordError}
            />
          </div>
          {formError && (
            <p className="text-red-500 text-sm text-center">{formError}</p>
          )}
          <Button
            type="submit"
            text="Login"
            disabled={!isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50"
          />
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
