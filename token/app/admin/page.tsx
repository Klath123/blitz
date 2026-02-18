"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";

interface AdminData {
  flag: string;
  users: {
    id: string;
    username: string;
    role: string;
    dept: string;
    status: string;
  }[];
  auditLog: {
    time: string;
    event: string;
    user: string;
    level: string;
  }[];
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

function parseJWT(token: string) {

  try {

    const payload =
      token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    return JSON.parse(
      atob(payload)
    );

  } catch {

    return null;

  }

}

export default function Admin() {

  const router = useRouter();

  const [data,
    setData] =
    useState<AdminData | null>(null);

  const [loading,
    setLoading] =
    useState(true);

  const [copied,
    setCopied] =
    useState(false);

  const [flagVisible,
    setFlagVisible] =
    useState(false);

  const [time,
    setTime] =
    useState("");

  const [username,
    setUsername] =
    useState("admin");

  // clock
  useEffect(()=>{

    const tick =
      ()=>setTime(
        new Date()
          .toUTCString()
      );

    tick();

    const t =
      setInterval(tick,1000);

    return ()=>clearInterval(t);

  },[]);

  // auth + fetch admin data
  useEffect(()=>{

    const token =
      getCookie("auth_token");

    if (!token) {

      router.push("/login");
      return;

    }

    const payload =
      parseJWT(token);

    if (!payload) {

      router.push("/login");
      return;

    }

    if (payload.role !== "admin") {

      router.push("/dashboard");
      return;

    }

    setUsername(
      payload.username ?? "admin"
    );

    fetch("/api/admin")
      .then(r =>
        r.json().then(d => ({
          ok: r.ok,
          d
        }))
      )
      .then(({ ok, d }) => {

        if (!ok) {

          router.push("/dashboard");

        } else {

          setData(d);

          setTimeout(
            ()=>setFlagVisible(true),
            600
          );

        }

      })
      .catch(() =>
        router.push("/dashboard")
      )
      .finally(() =>
        setLoading(false)
      );

  }, [router]);

  function copyFlag() {

    if (!data) return;

    navigator.clipboard.writeText(
      data.flag
    );

    setCopied(true);

    setTimeout(
      ()=>setCopied(false),
      2500
    );

  }

  if (loading)
    return (
      <div style={{
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"var(--bg)"
      }}>
        <div style={{
          fontFamily:"var(--mono)",
          color:"var(--gold)",
          fontSize:14,
          letterSpacing:"0.2em"
        }}>
          Verifying privileges...
        </div>
      </div>
    );

  if (!data)
    return null;

  const lvlColor:
    Record<string,string> = {

    INFO:"rgba(0,255,170,0.55)",

    WARN:"rgba(255,215,0,0.7)",

    ERROR:"rgba(255,68,102,0.7)"

  };

  return (
    <>
      <GridBackground />
      <Navbar />

      <div style={{
        position:"relative",
        zIndex:1,
        maxWidth:1000,
        margin:"0 auto",
        padding:"88px 28px 80px"
      }}>

        <h1 style={{
          color:"var(--gold)"
        }}>
          ADMIN DASHBOARD
        </h1>

        <p>
          {time} · {username}
        </p>

        {/* FLAG */}
        {flagVisible && (
          <div>

            <h3>
              🚩 FLAG
            </h3>

            <div style={{
              color:"gold",
              fontWeight:"bold",
              marginBottom:"10px"
            }}>
              {data.flag}
            </div>

            <button onClick={copyFlag}>
              {copied
                ? "Copied"
                : "Copy Flag"}
            </button>

          </div>
        )}

        {/* Users */}
        <h3>
          Users
        </h3>

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Dept</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {data.users.map(u=>(
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.dept}</td>
                <td>{u.status}</td>
              </tr>
            ))}

          </tbody>

        </table>

        {/* Audit log */}
        <h3>
          Audit Log
        </h3>

        {data.auditLog.map((l,i)=>(
          <div key={i}>

            <span style={{
              color:lvlColor[l.level]
            }}>
              [{l.level}]
            </span>

            {" "}

            {l.event}

          </div>
        ))}

      </div>
    </>
  );
}
