"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";

export default function Home() {

  return (
    <>
      <style>{`
        .hero-sub {
          font-family: var(--mono);
          font-size: 14px;
          color: rgba(0,255,170,0.7);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .hero-h1 {
          font-family: var(--orb);
          font-weight: 900;
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          color: var(--green);
          text-shadow:
            0 0 60px rgba(0,255,170,0.5),
            0 0 120px rgba(0,255,170,0.2);
          line-height: 1;
          margin-bottom: 16px;
          letter-spacing: 0.08em;
        }

        .hero-tag {
          font-family: var(--mono);
          font-size: 15px;
          color: rgba(0,255,170,0.6);
          letter-spacing: 0.15em;
          margin-bottom: 40px;
        }

        .btn-primary {
          font-family: var(--orb);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 15px 40px;
          background: var(--green);
          color: #060d0f;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }

        .btn-primary:hover {
          background: #00ddaa;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,255,170,0.35);
        }
      `}</style>

      <GridBackground />
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1
        }}
      >
        <div>

          <div className="hero-sub">
            Internal Employee Portal
          </div>

          <h1 className="hero-h1">
            BLITZ CORPORATION
          </h1>

          <div className="hero-tag">
            Secure · Authorized Access Only
          </div>

          <Link
            href="/login"
            className="btn-primary"
          >
            Access Portal
          </Link>

        </div>
      </main>
    </>
  );
}
