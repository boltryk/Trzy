// Smoke test: proves the built app, the Cloudflare adapter and the Supabase magic-link flow still work together.
// Zero dependencies on purpose. Run against a live server with local Supabase (Mailpit included):
//   BASE_URL=http://localhost:4321 MAILPIT_URL=http://127.0.0.1:54324 node scripts/smoke.mjs

import { setTimeout as sleep } from "node:timers/promises";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4321";
const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";
const email = `smoke-${Date.now()}@example.com`;
const jar = new Map();
let tokenHash = "";

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function storeCookies(response) {
  for (const raw of response.headers.getSetCookie()) {
    const [pair, ...attrs] = raw.split(";");
    const [name, ...rest] = pair.split("=");
    const expired = attrs.some((a) => /max-age=0/i.test(a.trim()));
    if (expired) jar.delete(name.trim());
    else jar.set(name.trim(), rest.join("="));
  }
}

async function request(path, { method = "GET", form } = {}) {
  const response = await fetch(BASE_URL + path, {
    method,
    redirect: "manual",
    headers: {
      Cookie: cookieHeader(),
      Origin: BASE_URL,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  storeCookies(response);
  return { status: response.status, location: response.headers.get("location") ?? "" };
}

// Reads the newest mail sent to `email` from Mailpit and pulls token_hash out of the magic link.
// Mail delivery is asynchronous, so poll for up to ~10 s.
async function readMagicLink() {
  const query = encodeURIComponent(`to:"${email}"`);
  for (let attempt = 0; attempt < 20; attempt++) {
    const list = await fetch(`${MAILPIT_URL}/api/v1/search?query=${query}`).then((r) => r.json());
    const id = list.messages?.[0]?.ID;
    if (id) {
      const message = await fetch(`${MAILPIT_URL}/api/v1/message/${id}`).then((r) => r.json());
      const match = /token_hash=([^&"\s]+)/.exec(message.HTML ?? "");
      if (match) {
        tokenHash = match[1];
        return { status: 200, location: "" };
      }
      return { status: 0, location: "mail without token_hash" };
    }
    await sleep(500);
  }
  return { status: 0, location: "no mail in Mailpit" };
}

const confirmForm = () => ({ token_hash: tokenHash, type: "email" });

const steps = [
  ["home renders", () => request("/"), { status: 200 }],
  ["dashboard redirects anonymous user", () => request("/dashboard"), { status: 302, location: "/auth/signin" }],
  [
    "signin rejects invalid email",
    () => request("/api/auth/signin", { method: "POST", form: { email: "nie-mail" } }),
    { status: 302, location: "/auth/signin?error=" },
  ],
  [
    "signin sends magic link",
    () => request("/api/auth/signin", { method: "POST", form: { email } }),
    { status: 302, location: "/auth/check-email" },
  ],
  ["mailbox has link with token_hash", () => readMagicLink(), { status: 200 }],
  ["confirm page shows button", () => request(`/auth/confirm?token_hash=${tokenHash}&type=email`), { status: 200 }],
  // D16: opening the link (what mail scanners do) must not sign in. That it also does not consume the code
  // is proven by the next step: it sends the same token_hash and must still succeed. Keep the order.
  ["opening link does not sign in", () => request("/dashboard"), { status: 302, location: "/auth/signin" }],
  [
    "confirm button signs in",
    () => request("/api/auth/confirm", { method: "POST", form: confirmForm() }),
    { status: 302, location: "/" },
  ],
  ["dashboard renders for signed-in user", () => request("/dashboard"), { status: 200 }],
  [
    "used link is rejected",
    () => request("/api/auth/confirm", { method: "POST", form: confirmForm() }),
    { status: 302, location: "/auth/signin?error=" },
  ],
  ["signout clears session", () => request("/api/auth/signout", { method: "POST" }), { status: 302, location: "/" }],
  ["dashboard redirects after signout", () => request("/dashboard"), { status: 302, location: "/auth/signin" }],
];

let failed = 0;
for (const [name, run, expected] of steps) {
  const actual = await run();
  const ok =
    actual.status === expected.status &&
    (expected.location === undefined || actual.location.startsWith(expected.location));
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  -> ${actual.status} ${actual.location}`);
  if (!ok) {
    failed++;
    console.log(`      expected ${expected.status} ${expected.location ?? ""}`);
  }
}

console.log(failed ? `\n${failed} step(s) failed` : "\nAll smoke steps passed");
process.exit(failed ? 1 : 0);
