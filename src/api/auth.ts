import { API_BASE } from './base';

// Retail: the cabinet launches the game as /?egmid=EGM1 — the EGM id is swapped for a session token
//   (POST /api/retail/session) and the game plays off that EGM's credit meter.
// Online: WSB platform launches the game as /?token=<jwt>.
// Dev/staging: the server exposes GET /api/dev-token which mints a random player.
const params = new URLSearchParams(window.location.search);

/** The cabinet this game runs on, when launched as ?egmid=… (null for an online launch). */
export const egmId = params.get('egmid') ?? params.get('egmId') ?? params.get('EGMID');
export const isRetailLaunch = !!egmId;

// Session tokens last 4 hours; a cabinet runs all day, so a retail token is renewed hourly
// (SignalR asks for a token again on every reconnect).
const RETAIL_REFRESH_MS = 60 * 60 * 1000;
const RETAIL_MAX_AGE_MS = 3.5 * 60 * 60 * 1000;

let cached: string | null = null;
let cachedAt = 0;

async function retailToken(): Promise<string> {
  const age = Date.now() - cachedAt;
  if (cached && age < RETAIL_REFRESH_MS) return cached;
  try {
    const res = await fetch(`${API_BASE}/api/retail/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ egmId }),
    });
    const body = (await res.json().catch(() => ({}))) as { token?: string; message?: string };
    if (!res.ok || !body.token) throw new Error(body.message ?? `EGM session failed (${res.status})`);
    cached = body.token;
    cachedAt = Date.now();
    return cached;
  } catch (err) {
    // A blip while renewing: keep playing on the current token while it is still valid.
    if (cached && age < RETAIL_MAX_AGE_MS) return cached;
    throw err;
  }
}

export async function getToken(): Promise<string> {
  // Never fall back to a demo player on a cabinet: a failed EGM session must stop play, not hand out credits.
  if (isRetailLaunch) return retailToken();
  if (cached) return cached;

  const fromUrl = params.get('token');
  if (fromUrl) {
    cached = fromUrl;
    return fromUrl;
  }

  const res = await fetch(`${API_BASE}/api/dev-token`);
  if (!res.ok) {
    throw new Error('No session token. Launch with ?token=<jwt> or ?egmid=<EGM id>, or run the API in Development mode.');
  }
  const body = (await res.json()) as { token: string };
  cached = body.token;
  return cached;
}
