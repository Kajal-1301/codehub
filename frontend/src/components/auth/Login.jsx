import { Mail, Lock, ArrowRight } from "lucide-react";
import AnimatedBackground from "../landingPage/AnimatedBackground";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";


export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: email,
        password: password,
      });

      const { token, userId } = res.data

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setCurrentUser(userId);
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500)

    } catch (err) {
      console.error("Login error:", err);

      toast.error(
        err.response?.data?.message || "Login failed!"
      )
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0f16] px-4 py-12 text-white">
      <AnimatedBackground />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0f16]/75 p-8">
        <div className="mb-6 flex flex-col items-center text-center">

          <img
            src="github-mark-white.svg"
            alt="CodeHub logo"
            className="mb-4 h-14 w-14 rounded-full bg-teal-400/10 p-3"
          />
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your account to continue.</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 py-2.5 text-sm font-semibold text-[#04342c] hover:bg-teal-300"
          >
            {loading ? "Loading..." : "Login"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-500">or</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>


        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account ?{" "}
          <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
