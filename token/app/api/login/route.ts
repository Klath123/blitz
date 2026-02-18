import { NextRequest, NextResponse } from "next/server";

// base64url helper
function b64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// intentionally weak JWT (CTF vulnerability)
function issueToken(payload: object): string {

  const header = b64url(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  );

  const body = b64url(
    JSON.stringify(payload)
  );

  // fake signature (never verified)
  const sig = b64url(
    `fake_hmac::${header}.${body}`
  );

  return `${header}.${body}.${sig}`;
}

const USERS: Record<
  string,
  { password: string; role: string }
> = {

  user: {
    password: "user123",
    role: "user",
  },

};

export async function POST(
  req: NextRequest
) {

  try {

    const {
      username,
      password
    } = await req.json();

    const account =
      USERS[username];

    if (
      !account ||
      account.password !== password
    ) {

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    }

    const now =
      Math.floor(Date.now() / 1000);

    const token =
      issueToken({
        username,
        role: account.role,
        iat: now,
        exp: now + 3600,
      });

    const res =
      NextResponse.json({
        message: "Login successful",
      });

    // NON-httpOnly cookie (CTF-friendly)
    res.cookies.set(
      "auth_token",
      token,
      {

        httpOnly: false, // IMPORTANT

        secure:
          process.env.NODE_ENV
          === "production",

        sameSite: "lax",

        path: "/",

        maxAge: 60 * 60,

      }
    );

    return res;

  } catch {

    return NextResponse.json(
      { error: "Bad request" },
      { status: 400 }
    );

  }

}
