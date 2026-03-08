"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "../store/auth/auth.types";
import { registerRequest } from "../store/auth/auth.api";
import { useAuthStore } from "../store/auth/auth.store";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Link from "next/link";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const storeAuthData = useAuthStore((s) => s.storeAuthData);
  const user = useAuthStore((s) => s.user);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Live validation for name
  useEffect(() => {
    const result = registerSchema.shape.name.safeParse(name);
    if (!name) {
      setNameError(null);
    } else if (!result.success) {
      setNameError(result.error.issues[0]?.message || "Invalid name");
    } else {
      setNameError(null);
    }
    // setFormError(null); // Removed
  }, [name]);

  // Live validation for email
  useEffect(() => {
    const result = registerSchema.shape.email.safeParse(email);
    if (!email) {
      setEmailError(null);
    } else if (!result.success) {
      setEmailError(result.error.issues[0]?.message || "Invalid email");
    } else {
      setEmailError(null);
    }
    // setFormError(null); // Removed
  }, [email]);

  // Live validation for password
  useEffect(() => {
    const result = registerSchema.shape.password.safeParse(password);
    if (!password) {
      setPasswordError(null);
    } else if (!result.success) {
      setPasswordError(result.error.issues[0]?.message || "Invalid password");
    } else {
      setPasswordError(null);
    }
    // setFormError(null); // Removed
  }, [password]);

  // Check overall form validity
  useEffect(() => {
    const overallResult = registerSchema.safeParse({ name, email, password });
    setIsValid(overallResult.success);
  }, [name, email, password]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setFormError(null); // Clear form error on input change
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormError(null); // Clear form error on input change
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormError(null); // Clear form error on input change
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // Clear form error on submission attempt

    const overallResult = registerSchema.safeParse({ name, email, password });
    if (!overallResult.success) {
      // Set individual errors if they are not already set by live validation
      if (!nameError) setNameError(registerSchema.shape.name.safeParse(name).success ? null : "Invalid name");
      if (!emailError) setEmailError(registerSchema.shape.email.safeParse(email).success ? null : "Invalid email");
      if (!passwordError) setPasswordError(registerSchema.shape.password.safeParse(password).success ? null : "Invalid password");
      setFormError("Please correct the errors in the form.");
      return;
    }

    try {
      const res = await registerRequest({ name, email, password });
      storeAuthData(res.data.user);
      router.push("/");
    } catch (error: any) {
      if (error.response) {
        setFormError(error.response.data?.message || "Registration failed");
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
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Input
              id="name"
              label="Name"
              type="text"
              value={name}
              onChange={handleNameChange} // Use new handler
              placeholder="Enter your name"
              error={nameError}
            />
          </div>
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
            text="Register"
            disabled={!isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50"
          />
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
