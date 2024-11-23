import React, { useState, useContext, useEffect } from "react";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!form.email || !form.password || (!isLogin && !form.username)) {
      setError("Both fields are required.");
      return;
    }
    setError(""); // Clear error if form is valid
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data } = await API.post("/auth/signin", {
          email: form.email,
          password: form.password,
        });
        console.log("Response data:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          login(data.token);
          navigate("/dashboard");
        } else {
          console.error("Token not found in response:", data);
          setError("An error occurred. Please try again.");
        }
      } else {
        const { data } = await API.post("/auth", {
          email: form.email,
          password: form.password,
          username: form.username,
        });
        if (data.message) {
          setIsLogin(true);
          setError("Signup successful! Please log in");
        } else {
          setError("Signup failed. Please try again");
        }
      }
    } catch (error) {
      setError(
        isLogin
          ? "Login failed. Please check your credentials."
          : "Signup failed. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-10 h-10 text-indigo-600" />
          <span className="text-2xl font-bold text-slate-800">
            Second Brain
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-slate-600 mb-6">
          {isLogin
            ? "Enter your email to sign in to your account"
            : "Enter your email below to create your account"}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="m@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="************"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Signing up..."
              : isLogin
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:underline focus:outline-none"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
