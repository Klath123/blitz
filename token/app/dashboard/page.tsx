"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";

interface JWTPayload {
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

function getCookie(name: string): string | null {

  const match =
    document.cookie
      .split("; ")
      .find(row =>
        row.startsWith(name + "=")
      );

  return match
    ? match.split("=")[1]
    : null;
}

function parseJWT(
  token: string
): JWTPayload | null {

  try {

    const base64 =
      token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    return JSON.parse(
      atob(base64)
    );

  } catch {

    return null;

  }
}

export default function Dashboard() {

  const [payload,
    setPayload] =
    useState<JWTPayload | null>(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    const token =
      getCookie("auth_token");

    if (!token) {

      setPayload(null);
      setLoading(false);
      return;

    }

    const decoded =
      parseJWT(token);

    setPayload(decoded);

    setLoading(false);

  }, []);

  if (loading)
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--green)",
        fontFamily: "var(--mono)"
      }}>
        Loading...
      </div>
    );

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
          position: "relative",
          zIndex: 1,
        }}
      >

        <div
          style={{
            padding: "40px",
            border:
              "1px solid rgba(0,255,170,0.2)",
            background:
              "rgba(6,13,15,0.95)",
            textAlign: "center",
            minWidth: "350px"
          }}
        >

          {!payload ? (

            <>
              <h2 style={{
                color: "red"
              }}>
                Unauthorized Access
              </h2>

              <p style={{
                color:
                  "rgba(255,0,0,0.6)"
              }}>
                No valid session cookie found.
              </p>
            </>

          ) : (

            <>
              <h2 style={{
                color:
                  "var(--green)"
              }}>
                Logged in as
              </h2>

              <p style={{
                fontSize: "20px",
                color:
                  "var(--cyan)"
              }}>
                {payload.username}
              </p>

              <p style={{
                marginTop: "10px"
              }}>
                Role:
                <strong style={{
                  marginLeft: "8px",
                  color:
                    payload.role === "admin"
                      ? "gold"
                      : "var(--green)"
                }}>
                  {payload.role}
                </strong>
              </p>

              {payload.role === "admin" && (

                <div style={{
                  marginTop: "20px",
                  color: "gold"
                }}>
                  Admin privileges detected.
                </div>

              )}

            </>

          )}

        </div>

      </main>
    </>
  );
}
