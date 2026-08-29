// Sesión de vendedor. Firmada con HMAC-SHA256 (WebCrypto) para que
// funcione tanto en Server Actions como en middleware. Sin dependencias.

export const SESSION_COOKIE = "destello_admin_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

export type Seller = {
  name: string;
  password: string;
};

const encoder = new TextEncoder();

function parseSellers(): Seller[] {
  const raw = process.env.ADMIN_CREDENTIALS ?? "";
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, ...rest] = pair.split(":");
      return { name: name.trim(), password: rest.join(":").trim() };
    })
    .filter((s) => s.name && s.password);
}

export function getSellers(): Seller[] {
  return parseSellers();
}

export function verifyCredentials(name: string, password: string): Seller | null {
  const normalized = name.trim().toLowerCase();
  return (
    parseSellers().find(
      (seller) => seller.name.toLowerCase() === normalized && seller.password === password,
    ) ?? null
  );
}

async function secretKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.SESSION_SECRET ?? "destello-dev-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toB64Url(byteArray: Uint8Array): string {
  let binary = "";
  for (const byte of byteArray) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function encodePayload(payload: Record<string, unknown>): string {
  return toB64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

function decodePayload<T>(value: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(fromB64Url(value))) as T;
  } catch {
    return null;
  }
}

export type SessionPayload = {
  v: string; // nombre del vendedor
  exp: number; // expiración (epoch ms)
};

export async function createSessionToken(sellerName: string): Promise<string> {
  const payload: SessionPayload = { v: sellerName, exp: Date.now() + SESSION_TTL_MS };
  const p = encodePayload(payload);
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", await secretKey(), encoder.encode(p)),
  );
  return `${p}.${toB64Url(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const p = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const key = await secretKey();
  const sigBytes = fromB64Url(sig).slice(); // Uint8Array (no SharedArrayBuffer)
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(p));
  if (!valid) return null;

  const payload = decodePayload<SessionPayload>(p);
  if (!payload || typeof payload.v !== "string" || typeof payload.exp !== "number") {
    return null;
  }
  if (payload.exp < Date.now()) return null;
  return payload.v;
}