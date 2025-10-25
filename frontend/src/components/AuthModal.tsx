"use client";

import { useState } from "react";
import apiClient from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "login" | "register";

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  if (!open) {
    return null;
  }

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError(null);
    setMode("login");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email, password }
        : { email, password, fullName };

      const { data } = await apiClient.post(endpoint, payload);
      setAuth({ id: data.userId, email: data.email, fullName: data.fullName }, data.token);
      handleClose();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-500 py-2 text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                className="font-semibold text-pink-500 hover:underline"
                onClick={() => setMode("register")}
                type="button"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="font-semibold text-pink-500 hover:underline"
                onClick={() => setMode("login")}
                type="button"
              >
                Sign in
              </button>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={handleClose}
          className="mt-6 block w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
