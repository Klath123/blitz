"use client";
import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";

const SECTIONS = [
  {
    title: "Getting Started",
    color: "#00ffaa",
    items: [

      {
        q: "How do I log in?",
        a:
`Navigate to the Login page and enter your employee credentials.

On successful authentication, the system issues a JSON Web Token (JWT) and stores it in your browser as a cookie named:

  auth_token

This token is automatically sent with future requests.`
      },

      {
        q: "What is a JWT?",
        a:
`A JSON Web Token is a compact authentication token consisting of three Base64url-encoded parts:

  Header.Payload.Signature

Example:

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  .
  eyJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoidXNlciJ9
  .
  signature_here

The payload contains your identity and access level.`
      },

      {
        q: "Where is my token stored?",
        a:
`Your token is stored as a browser cookie.

To view it:

  DevTools → Application → Storage → Cookies → auth_token

You may decode the token using any Base64 decoder.`
      },

    ]
  },

  {
    title: "API Reference",
    color: "#00ccff",
    items: [

      {
        q: "POST /api/login",
        a:
`Authenticates a user.

Request Body:
  {
    "username": "user",
    "password": "user123"
  }

On success:
  • Issues JWT
  • Stores auth_token cookie

Default credentials:
  username: user
  password: user123`
      },

      {
        q: "GET /api/dashboard",
        a:
`Returns dashboard information.

Requirements:
  Valid auth_token cookie

Accessible roles:
  • user
  • admin`
      },

      {
        q: "GET /api/admin",
        a:
`Administrative endpoint.

Requirements:
  Valid auth_token cookie

Required role:
  admin

Example request:
  GET /api/admin

Example response:
  {
    "flag": "blitz{...}",
    "status": "admin access granted"
  }

If access denied:
  HTTP 403 Forbidden`
      },

    ]
  },

  {
    title: "Security Notes",
    color: "#ffd700",
    items: [

      {
        q: "Token Payload",
        a:
`The JWT payload contains identity and privilege information:

  {
    "username": "user",
    "role": "user",
    "iat": 1700000000,
    "exp": 1700003600
  }`
      },

      {
        q: "Role-Based Access Control",
        a:
`Access to administrative endpoints depends on the "role" field.

Roles:
  user   → standard access
  admin  → privileged access`
      },

      {
        q: "Integrity Verification",
        a:
`JWT tokens include a signature to ensure integrity.

However, always verify how the server validates the token.

If payload data changes, what happens?`
      },

    ]
  },
];

export default function Docs() {
  return (
    <>
      <style>{`
        .doc-wrap  { max-width:800px;margin:0 auto;padding:100px 28px 80px; }
        .doc-hdr   { margin-bottom:52px;animation:fadeUp 0.6s ease both; }
        .doc-sub   { font-family:var(--mono);font-size:12px;color:rgba(0,255,170,0.5);letter-spacing:0.3em;text-transform:uppercase;margin-bottom:14px; }
        .doc-h1    { font-family:var(--orb);font-weight:900;font-size:clamp(1.8rem,4vw,2.6rem);color:var(--green);letter-spacing:0.1em;margin-bottom:12px;text-shadow:0 0 40px rgba(0,255,170,0.4); }
        .doc-desc  { font-family:var(--mono);font-size:14px;color:rgba(0,255,170,0.65);letter-spacing:0.08em;line-height:1.7; }
        .toc       { background:rgba(3,8,10,0.8);border:1px solid rgba(0,255,170,0.1);padding:22px 26px;margin-bottom:52px; }
        .toc-t     { font-family:var(--mono);font-size:10px;color:rgba(0,255,170,0.4);letter-spacing:0.28em;text-transform:uppercase;margin-bottom:14px; }
        .toc-l     { display:block;font-family:var(--mono);font-size:13px;color:rgba(0,255,170,0.65);text-decoration:none;padding:5px 0;letter-spacing:0.08em;transition:color 0.15s; }
        .toc-l:hover{ color:var(--green); }
        .toc-l::before{ content:"› ";color:rgba(0,255,170,0.3); }
        .doc-sec   { margin-bottom:64px;animation:fadeUp 0.7s ease both; }
        .sec-hdr   { font-family:var(--orb);font-size:15px;font-weight:700;letter-spacing:0.14em;padding-bottom:12px;border-bottom:1px solid;margin-bottom:24px;display:flex;align-items:center;gap:10px; }
        .doc-entry { background:rgba(3,8,10,0.75);border:1px solid rgba(0,255,170,0.07);padding:22px 24px;margin-bottom:12px;transition:border-color 0.2s; }
        .doc-entry:hover{ border-color:rgba(0,255,170,0.2); }
        .doc-q     { font-family:var(--mono);font-size:14px;color:var(--green);margin-bottom:12px;letter-spacing:0.08em; }
        .doc-a     { font-family:var(--mono);font-size:13px;color:rgba(0,255,170,0.7);line-height:1.9;letter-spacing:0.04em;white-space:pre-wrap; }
      `}</style>

      <GridBackground />
      <Navbar />

      <div className="doc-wrap">
        <div className="doc-hdr">
          <div className="doc-sub">◈ Internal Reference</div>
          <h1 className="doc-h1">DOCUMENTATION<span style={{animation:"blink 1s step-end infinite"}}>_</span></h1>
          <div className="doc-desc">Portal reference for employees, developers, and system administrators.</div>
        </div>

        <div className="toc">
          <div className="toc-t">Table of Contents</div>
          {SECTIONS.map(s=><a key={s.title} href={`#${s.title.replace(/\s/g,"-")}`} className="toc-l">{s.title}</a>)}
        </div>

        {SECTIONS.map((s,si)=>(
          <div key={s.title} id={s.title.replace(/\s/g,"-")} className="doc-sec" style={{animationDelay:`${si*0.1}s`}}>
            <div className="sec-hdr" style={{color:s.color,borderBottomColor:s.color+"33"}}>
              <span style={{opacity:0.5,fontSize:10}}>◈</span>{s.title}
            </div>
            {s.items.map(e=>(
              <div key={e.q} className="doc-entry">
                <div className="doc-q">{e.q}</div>
                <div className="doc-a">{e.a}</div>
              </div>
            ))}
          </div>
        ))}

        <div style={{fontFamily:"var(--mono)",fontSize:11,color:"rgba(0,255,170,0.25)",borderTop:"1px solid rgba(0,255,170,0.06)",paddingTop:24,textAlign:"center",letterSpacing:"0.15em"}}>
          BLITZ CORP INTERNAL DOCUMENTATION · v2.4.1 · LAST UPDATED 2024-12-01
        </div>
      </div>
    </>
  );
}