"use client"
import { useState } from "react";

import Link from "next/link";
import { UseAuth } from "../context/useAuth";
import { useRouter } from "next/navigation"; 
export default function Signup() {
  const { signEmailPass, signInGoogle } = UseAuth(); // Access the signup function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signEmailPass(email, password, true); 
    } catch (error) {
      
      setError(error.message)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={()=>{
            signInGoogle();
            router.push('/')
          }}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4 rounded-lg"
        >
          Sign In with Google
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
