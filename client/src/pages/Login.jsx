import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { toastSuccess, toastError, toastLoading } from "../utils/toast";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingId = "Logging in...";
    toastLoading(loadingId);

    try {
      const { data } = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      toast.dismiss(loadingId);

      if (data.token) {
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        toastSuccess("Login successful 🎉");
        navigate("/callpage");
      } else {
        toastError(data.message || "Login failed");
      }
    } catch (err) {
      toast.dismiss(loadingId);
      toastError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          className="h-full object-cover opacity-80"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="login visual"
        />
      </div>

      {/* Login Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[380px] p-8 rounded-2xl
          bg-slate-900/80 backdrop-blur-xl
          border border-slate-800 shadow-xl"
        >
          <h2 className="text-3xl font-semibold text-slate-100 text-center">
            Sign in
          </h2>
          <p className="text-sm text-slate-400 text-center mt-2">
            Welcome back! Continue your fitness journey
          </p>

          <div className="mt-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-12 px-4 rounded-lg
              bg-slate-800 text-slate-200 placeholder-slate-400
              border border-slate-700 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mt-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 px-4 rounded-lg
              bg-slate-800 text-slate-200 placeholder-slate-400
              border border-slate-700 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-7 w-full h-11 rounded-lg
            bg-indigo-600 hover:bg-indigo-700
            text-white font-medium transition"
          >
            Login
          </button>

          <p className="text-slate-400 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-indigo-400 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
