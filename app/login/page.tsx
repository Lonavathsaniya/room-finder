"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "http://localhost:3000/add-room",
      },
    });

    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage("✅ Check your email for the login link!");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          🔐 Owner Login
        </h1>

        <p className="text-gray-600 text-center mb-4">
          Enter your email to receive a secure login link.
        </p>

        <form onSubmit={sendOTP} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Login Link"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-medium">{message}</p>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
