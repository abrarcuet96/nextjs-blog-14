import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
export const AUTH_COOKIE = "nextjs-blog-14";

function getSecret() {
  if (!SECRET) {
    throw new Error("Please define JWT_SECRET in your environment variables.");
  }

  return SECRET;
}

export function generateToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export function setAuthCookie(response, token) {
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}
