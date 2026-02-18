import { NextRequest, NextResponse } from "next/server";

const FLAG = "blitz{jwt_signature_not_verified}";

function decodeToken(token: string) {

  try {

    const payload =
      token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    return JSON.parse(
      Buffer.from(payload, "base64").toString()
    );

  } catch {

    return null;

  }

}

export async function GET(req: NextRequest) {

  const token =
    req.cookies.get("auth_token")?.value;

  if (!token) {

    return NextResponse.json(
      { error: "Unauthorized: No token" },
      { status: 401 }
    );

  }

  const decoded = decodeToken(token);

  if (!decoded) {

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );

  }

  if (decoded.role !== "admin") {

    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );

  }

  // FIX: return full structure expected by frontend
  return NextResponse.json({

    flag: FLAG,

    users: [

      {
        id: "U001",
        username: decoded.username ?? "admin",
        role: "admin",
        dept: "Security",
        status: "ACTIVE"
      },

      {
        id: "U002",
        username: "john",
        role: "user",
        dept: "Engineering",
        status: "ACTIVE"
      },

      {
        id: "U003",
        username: "sarah",
        role: "user",
        dept: "HR",
        status: "INACTIVE"
      }

    ],

    auditLog: [

      {
        time: new Date().toUTCString(),
        event: "Admin login detected",
        user: decoded.username ?? "admin",
        level: "INFO"
      },

      {
        time: new Date().toUTCString(),
        event: "JWT role escalation detected",
        user: decoded.username ?? "admin",
        level: "WARN"
      },

      {
        time: new Date().toUTCString(),
        event: "Flag accessed",
        user: decoded.username ?? "admin",
        level: "ERROR"
      }

    ]

  });

}
