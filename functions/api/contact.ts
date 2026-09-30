interface Env {
  EMAIL?: EmailBinding;
  CONTACT_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_SUBJECT_PREFIX?: string;
}

interface EmailBinding {
  send(message: EmailMessagePayload): Promise<{ messageId?: string }>;
}

interface EmailMessagePayload {
  to: string | EmailAddress | Array<string | EmailAddress>;
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | EmailAddress;
}

interface EmailAddress {
  email: string;
  name?: string;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  business?: unknown;
  businessType?: unknown;
  projectType?: unknown;
  customerAction?: unknown;
  biggestFriction?: unknown;
  budget?: unknown;
  timeline?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  const cloudflareFromEmail = env.CONTACT_FROM_EMAIL || env.RESEND_FROM_EMAIL;
  const hasCloudflareEmail = Boolean(env.EMAIL && cloudflareFromEmail);
  const hasResendEmail = Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);

  if (!env.CONTACT_TO_EMAIL || (!hasCloudflareEmail && !hasResendEmail)) {
    return json({ ok: false, error: "Contact form is not configured yet." }, 500);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "Invalid request." }, 415);
  }

  const body = await request.text();
  if (body.length > 12_000) {
    return json({ ok: false, error: "Message is too large." }, 413);
  }

  let payload: ContactPayload;
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json({ ok: false, error: "Invalid request." }, 400);
    }
    payload = parsed as ContactPayload;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  if (asString(payload.companyWebsite)) {
    return json({ ok: true });
  }

  const name = asString(payload.name);
  const email = asString(payload.email);
  const business = asString(payload.business);
  const businessType = asString(payload.businessType);
  const projectType = asString(payload.projectType);
  const customerAction = asString(payload.customerAction);
  const biggestFriction = asString(payload.biggestFriction);
  const budget = asString(payload.budget);
  const timeline = asString(payload.timeline);
  const message = asString(payload.message);

  if (!name || !email || !message) {
    return json({ ok: false, error: "Please include your name, email, and project details." }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 400);
  }

  const subjectPrefix = env.CONTACT_SUBJECT_PREFIX || "New AI Build Studio Lead";
  const subject = `${subjectPrefix}: ${business || name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Business: ${business || "Not provided"}`,
    `Business type: ${businessType || "Not provided"}`,
    `Project type: ${projectType || "Not provided"}`,
    `Best customer action: ${customerAction || "Not provided"}`,
    `Biggest friction: ${biggestFriction || "Not provided"}`,
    `Budget: ${budget || "Not provided"}`,
    `Timeline: ${timeline || "Not provided"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = renderEmailHtml({
    name,
    email,
    business,
    businessType,
    projectType,
    customerAction,
    biggestFriction,
    budget,
    timeline,
    message,
  });
  let sent = false;
  try {
    sent = await sendLeadEmail({ env, cloudflareFromEmail, replyTo: email, subject, text, html });
  } catch {
    // Provider errors must return a usable failure without exposing credentials.
    return json({ ok: false, error: "Email could not be sent right now." }, 502);
  }

  if (!sent) {
    return json({ ok: false, error: "Email could not be sent right now." }, 502);
  }

  return json({ ok: true });
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 2000) : "";
}

async function sendLeadEmail({
  env,
  cloudflareFromEmail,
  replyTo,
  subject,
  text,
  html,
}: {
  env: Env;
  cloudflareFromEmail?: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  if (env.EMAIL && cloudflareFromEmail) {
    await env.EMAIL.send({
      from: cloudflareFromEmail,
      to: env.CONTACT_TO_EMAIL!,
      replyTo,
      subject,
      text,
      html,
    });
    return true;
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  return response.ok;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(payload: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders,
  });
}

function renderEmailHtml({
  name,
  email,
  business,
  businessType,
  projectType,
  customerAction,
  biggestFriction,
  budget,
  timeline,
  message,
}: {
  name: string;
  email: string;
  business: string;
  businessType: string;
  projectType: string;
  customerAction: string;
  biggestFriction: string;
  budget: string;
  timeline: string;
  message: string;
}): string {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Business", business || "Not provided"],
    ["Business type", businessType || "Not provided"],
    ["Project type", projectType || "Not provided"],
    ["Best customer action", customerAction || "Not provided"],
    ["Biggest friction", biggestFriction || "Not provided"],
    ["Budget", budget || "Not provided"],
    ["Timeline", timeline || "Not provided"],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#17202a;line-height:1.5">
      <h1 style="font-size:22px;margin:0 0 16px">New AI Build Studio lead</h1>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #dce4df;padding:10px;font-weight:bold;background:#eef5f1">${escapeHtml(label)}</td>
                <td style="border:1px solid #dce4df;padding:10px">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h2 style="font-size:18px;margin:22px 0 8px">Message</h2>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}
