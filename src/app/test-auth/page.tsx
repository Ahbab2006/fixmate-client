
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleTest = async () => {
    setLoading(true);
    setResult("");

    try {
      // Get JWT Token from Better Auth
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "Unable to get JWT token!");
        return;
      }

      // Send JWT Token to Backend
      const response = await fetch(
        "http://localhost:5000/api/test/protected",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setResult(responseData.message || "Authentication failed!");
        return;
      }

      setResult(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const getToken = async () => {
  const { data, error } = await authClient.token();

  if (error) {
    console.log(error);
    return;
  }

  console.log("JWT Token:", data.token);
};


  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          JWT Authentication Test
        </h1>

        <p className="mb-6 text-gray-600">
          Test your Better Auth JWT with the FixMate backend.
        </p>

        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Authentication"}
        </button>
        <button
          onClick={getToken}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          Get JWT Token
        </button>

        {result && (
          <pre className="mt-6 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-gray-100 p-4 text-sm text-gray-800">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
