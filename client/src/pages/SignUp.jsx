import logo from "../assets/logo-189x46.svg";
import google from "../assets/google-icon.png";
import apple from "../assets/apple-icon.png";
import facebook from "../assets/facebook-icon.png";
import { InputWithLabel } from "../components/InputWithLabel.jsx";
import { useState } from "react";
import { signup } from "../api/auth.js";
import { useNavigate } from "react-router";

export const SignUp = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.response?.data?.message || "Signup failed");
    }
  };
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col xl:flex-row items-center justify-center">
      <div className="space-y-8 flex flex-col items-center p-2 w-full max-w-md md:max-w-2xl xl:max-w-md px-4">
        <img src={logo} alt="company logo" />
        <div className="text-center">
          <h1 className="text-xl font-bold">Let’s Get Started</h1>
          <p className="text-gray-600">Fill the form to continue</p>
        </div>
        <form
          method="POST"
          className="space-y-8 flex flex-col items-center p-2 w-full max-w-md md:max-w-2xl xl:max-w-md px-4"
          onSubmit={handleSubmit}
        >
          <InputWithLabel
            label={"Username"}
            id={"username"}
            name={"username"}
            type={"text"}
            value={form.username}
            onChange={handleChange}
          />
          <InputWithLabel
            label={"Email"}
            id={"email"}
            name={"email"}
            type={"email"}
            value={form.email}
            onChange={handleChange}
          />
          <InputWithLabel
            label={"Password"}
            id={"password"}
            name={"password"}
            type={"password"}
            value={form.password}
            onChange={handleChange}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full px-4 py-2 bg-black rounded text-white hover:cursor-pointer">
            Sign Up
          </button>
        </form>
        <div className="flex flex-col w-full max-w-md md:max-w-2xl xl:max-w-md justify-center items-center gap-12">
          <div className="w-full flex items-center gap-4">
            <hr className="w-full border-gray-400" />
            <p className="text-gray-400">OR</p>
            <hr className="w-full  border-gray-400" />
          </div>
          <div className="space-x-5">
            <button className="hover:cursor-pointer">
              <img src={google} alt="google-icon" />
            </button>
            <button>
              <img
                src={apple}
                alt="google-icon"
                className="hover:cursor-pointer"
              />
            </button>
            <button>
              <img
                src={facebook}
                alt="google-icon"
                className="hover:cursor-pointer"
              />
            </button>
          </div>
          <p>
            Already have an account?{" "}
            <a href="/signin" className="font-bold underline">
              Sign In
            </a>
          </p>
        </div>
      </div>

      <div className="hidden xl:block w-full bg-black h-screen text-white"></div>
    </main>
  );
};
