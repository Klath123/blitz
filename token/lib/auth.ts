import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = "supersecretkey";

export interface TokenPayload extends JwtPayload {
  username: string;
  type: "user" | "admin";
}

// Create token (always user)
export function createToken(username: string): string {

  return jwt.sign(
    {
      username,
      type: "user",
    },
    SECRET,
    {
      expiresIn: "1h",
    }
  );
}

// VULNERABLE verification
export function verifyToken(token: string): TokenPayload | null {

  try {

    // ❌ INTENTIONAL VULNERABILITY
    // decode does NOT verify signature

    const decoded =
      jwt.decode(token) as TokenPayload;

    return decoded;

  } catch {

    return null;

  }
}
