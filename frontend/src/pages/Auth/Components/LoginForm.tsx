import { AnimatedText } from "./AnimatedText";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  // State to store form data and errors
  const [data, setData] = useState({ email: "", password: "" });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    schema.parse({ email: data.email });
    console.log("Form submitted:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <AnimatedText>
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-600 mb-6">Log in to access your portfolio</p>
      </AnimatedText>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatedText delay={0.1}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </AnimatedText>

        <AnimatedText delay={0.2}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </AnimatedText>

        <AnimatedText delay={0.3}>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-[1.01]"
          >
            Log in
          </button>
        </AnimatedText>
      </form>

      <AnimatedText delay={0.4}>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <button
            onClick={onToggle}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up here
          </button>
        </p>
      </AnimatedText>
    </motion.div>
  );
};
export default LoginForm;
