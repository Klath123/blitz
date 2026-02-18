"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";

export default function Login() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin() {

    setLoading(true);
    setError("");

    try {

      const res =
        await fetch("/api/login", {

          method: "POST",

          credentials: "include", // IMPORTANT

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),

        });

      if (!res.ok) {

        const data =
          await res.json();

        setError(
          data.error ||
          "Login failed"
        );

        setLoading(false);
        return;
      }

      // Cookie is now set by backend

      router.push("/dashboard");

    } catch {

      setError(
        "Network error"
      );

    }

    setLoading(false);
  }

  return (
    <>
      <GridBackground />
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          position: "relative",
          zIndex: 1,
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background:
              "rgba(6,13,15,0.95)",
            border:
              "1px solid rgba(0,255,170,0.2)",
            padding: "30px",
          }}
        >

          <h2
            style={{
              color: "var(--green)",
              marginBottom: "20px",
            }}
          >
            Employee Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>
              setUsername(
                e.target.value
              )
            }
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>
              setPassword(
                e.target.value
              )
            }
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "10px",
            }}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background:
                "var(--green)",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Authenticating..."
              : "Login"}
          </button>

          {error && (
            <p
              style={{
                color: "red",
                marginTop: "10px",
              }}
            >
              {error}
            </p>
          )}

        </div>

      </main>
    </>
  );
}
