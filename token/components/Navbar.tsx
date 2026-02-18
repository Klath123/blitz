"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Navbar() {

  const path = usePathname();
  const router = useRouter();

  const [role,
    setRole] =
    useState<string | null>(null);

  const [loggedIn,
    setLoggedIn] =
    useState(false);

  useEffect(() => {

    const token =
      getCookie("auth_token");

    if (!token) {

      setLoggedIn(false);
      setRole(null);
      return;

    }

    const payload =
      parseJWT(token);

    if (!payload) {

      setLoggedIn(false);
      setRole(null);
      return;

    }

    setLoggedIn(true);
    setRole(payload.role);

  }, [path]);

  function logout() {

    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    setLoggedIn(false);
    setRole(null);

    router.push("/login");

  }

  return (
    <>
      <style>{`
        .nav {
          position:fixed; top:0; left:0; right:0; z-index:200; height:60px;
          background:rgba(6,13,15,0.96); border-bottom:1px solid rgba(0,255,170,0.15);
          backdrop-filter:blur(18px); display:flex; align-items:center; padding:0 36px; gap:0;
        }
        .nav-logo {
          font-family:var(--orb); font-weight:900; font-size:15px; color:var(--green);
          letter-spacing:0.22em; text-decoration:none; margin-right:auto;
          text-shadow:0 0 28px rgba(0,255,170,0.55);
        }
        .nl {
          font-family:var(--mono); font-size:12px; letter-spacing:0.18em; color:rgba(0,255,170,0.6);
          text-decoration:none; padding:8px 18px; border:1px solid transparent;
          text-transform:uppercase; transition:all 0.16s; white-space:nowrap;
        }
        .nl:hover,.nl.active { color:var(--green); border-color:rgba(0,255,170,0.28); background:rgba(0,255,170,0.06); }
        .nl.gold { color:rgba(255,215,0,0.7); }
        .nl.gold:hover,.nl.gold.active { color:var(--gold); border-color:rgba(255,215,0,0.3); background:rgba(255,215,0,0.06); }
        .nav-badge {
          font-family:var(--mono); font-size:10px; letter-spacing:0.12em; padding:3px 10px;
          margin:0 10px; border:1px solid rgba(0,255,170,0.35); color:var(--green);
          background:rgba(0,255,170,0.08);
        }
        .nav-badge.admin { border-color:rgba(255,215,0,0.35); color:var(--gold); background:rgba(255,215,0,0.08); }
        .nav-logout {
          font-family:var(--mono); font-size:11px; letter-spacing:0.12em; padding:7px 16px;
          background:transparent; border:1px solid rgba(255,68,102,0.45); color:rgba(255,68,102,0.85);
          cursor:pointer; text-transform:uppercase; transition:all 0.16s;
        }
        .nav-logout:hover { background:rgba(255,68,102,0.08); border-color:var(--red); color:var(--red); }
        @media(max-width:640px){ .nav{padding:0 16px;} .nl{padding:6px 10px; font-size:11px;} }
      `}</style>

      <nav className="nav">

        <Link href="/" className="nav-logo">
          ⬡ BLITZ CORP
        </Link>

        <div style={{display:"flex",alignItems:"center",gap:2}}>

          <Link href="/" className={`nl${path==="/"?" active":""}`}>
            Home
          </Link>

          {/* ADDED — always visible */}
          <Link href="/docs" className={`nl${path==="/docs"?" active":""}`}>
            Docs
          </Link>

          {!loggedIn && (
            <Link href="/login" className={`nl${path==="/login"?" active":""}`}>
              Login
            </Link>
          )}

          {loggedIn && (
            <Link href="/dashboard" className={`nl${path==="/dashboard"?" active":""}`}>
              Dashboard
            </Link>
          )}

          {loggedIn && role==="admin" && (
            <Link href="/admin" className={`nl gold${path==="/admin"?" active":""}`}>
              Admin ⚑
            </Link>
          )}

          {loggedIn && (
            <>
              <span className={`nav-badge${role==="admin"?" admin":""}`}>
                {role??"user"}
              </span>

              <button className="nav-logout" onClick={logout}>
                Logout
              </button>
            </>
          )}

        </div>

      </nav>
    </>
  );
}
