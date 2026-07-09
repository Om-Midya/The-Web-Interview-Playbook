export const JWT_HEADER = '{"alg":"HS256","typ":"JWT"}';
export const DEFAULT_PAYLOAD = JSON.stringify(
  { sub: '42', name: 'Archie', role: 'user', iat: 1720000000 },
  null,
  2,
);
export const DEFAULT_SECRET = 'playbook-secret';

export function hasWebCrypto(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.subtle;
}

/** Unicode-safe base64url, no padding. */
export function b64urlEncode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Inverse of b64urlEncode; throws on invalid base64 input. */
export function b64urlDecode(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export interface DecodedToken {
  headerRaw: string;
  payloadRaw: string;
  signature: string;
  header: unknown | null;
  payload: unknown | null;
}

export function splitToken(token: string): DecodedToken | null {
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((p) => p.length === 0)) return null;
  const tryParse = (seg: string): unknown | null => {
    try {
      return JSON.parse(b64urlDecode(seg));
    } catch {
      return null;
    }
  };
  return {
    headerRaw: parts[0],
    payloadRaw: parts[1],
    signature: parts[2],
    header: tryParse(parts[0]),
    payload: tryParse(parts[1]),
  };
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

function bufToB64url(buf: ArrayBuffer): string {
  let bin = '';
  for (const b of new Uint8Array(buf)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Sign payload JSON under the fixed HS256 header; returns the full token. */
export async function signToken(payloadJson: string, secret: string): Promise<string> {
  const signingInput = `${b64urlEncode(JWT_HEADER)}.${b64urlEncode(payloadJson)}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${bufToB64url(sig)}`;
}

export async function verifyToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  return bufToB64url(sig) === parts[2];
}

/** Flip role user→admin inside the payload segment WITHOUT re-signing —
 * the classic tampering attack the signature exists to catch. */
export function tamperToken(token: string): string {
  const d = splitToken(token);
  if (!d) return token; // fail-soft
  let payloadJson: string;
  try {
    payloadJson = b64urlDecode(d.payloadRaw);
  } catch {
    return token;
  }
  const tampered = /"role":\s*"user"/.test(payloadJson)
    ? payloadJson.replace(/"role":\s*"user"/, '"role": "admin"')
    : /^\s*\{\s*\}\s*$/.test(payloadJson)
      ? '{"role": "admin"}'
      : payloadJson.replace(/}\s*$/, ', "role": "admin"}');
  return `${d.headerRaw}.${b64urlEncode(tampered)}.${d.signature}`;
}
