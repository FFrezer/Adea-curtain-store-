"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/admin/dashboard";
    } else {
      alert("Wrong credentials");
    }
  }

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Admin Login</h1>

      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-2"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="mt-4 bg-black text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
}