export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const SITE_NAME = 'Gulf Blvd Concrete Works';
const FROM_DEFAULT = 'leads@gulfblvdconcrete.com';

const EMAIL_CONTENT: Record<string, { subject: string; html: string }> = {
  'cost-calculator': {
    subject: 'Your Pool Deck Cost Estimate — Gulf Blvd Concrete',
    html: `
<h2>Your Pool Deck Resurfacing Cost Estimate</h2>
<p>Gulf Blvd Concrete Works — Pinellas County, FL</p>
<p>Thank you for using our cost calculator. Here's what you need to know about pool deck resurfacing costs on Gulf Blvd:</p>
<h3>💰 2025 Cost Ranges — Pinellas County</h3>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
<tr><th>Finish Type</th><th>Per Sq Ft</th><th>400 sq ft deck</th><th>600 sq ft deck</th></tr>
<tr><td>Basic resurface (broom)</td><td>$3–$6</td><td>$1,200–$2,400</td><td>$1,800–$3,600</td></tr>
<tr><td>Textured/exposed aggregate</td><td>$5–$9</td><td>$2,000–$3,600</td><td>$3,000–$5,400</td></tr>
<tr><td>Stamped/decorative overlay</td><td>$8–$14</td><td>$3,200–$5,600</td><td>$4,800–$8,400</td></tr>
<tr><td>Kool Deck / Cool touch</td><td>$6–$10</td><td>$2,400–$4,000</td><td>$3,600–$6,000</td></tr>
</table>
<h3>⚠️ What Drives Costs Up on Gulf Blvd</h3>
<ul>
<li>Salt air damage: concrete with efflorescence or spalling requires grinding before resurfacing (+$1–2/sq ft)</li>
<li>Pool cage base removal and reinstall if resurfacing under the cage (+$300–600)</li>
<li>Timing: pouring in summer heat requires faster-set mixes and shade setup (+10%)</li>
<li>Marine-grade sealer (recommended within 1 mile of Gulf): add $0.50–1.00/sq ft</li>
</ul>
<p><strong>Ready for an exact quote?</strong> Call us: <a href="tel:(727)555-0200">(727) 555-0200</a> | <a href="https://gulfblvdconcrete.com/contact">Request free on-site estimate</a></p>
    `,
  },
};

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400, headers });
  }

  const { email, name, magnetId } = body;

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'A valid email address is required.' }), { status: 422, headers });
  }

  const content = EMAIL_CONTENT[magnetId];
  if (!content) {
    return new Response(JSON.stringify({ error: 'Unknown lead magnet.' }), { status: 400, headers });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500, headers });
  }

  const resend = new Resend(apiKey);
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL ?? FROM_DEFAULT;

  const greeting = name ? `<p>Hi ${name},</p>` : '<p>Hi there,</p>';
  const fullHtml = `${greeting}${content.html}<hr><p style="color:#666;font-size:12px">You requested this guide from ${SITE_NAME}. Questions? Reply to this email.</p>`;

  const { error } = await resend.emails.send({
    from: `${SITE_NAME} <${fromEmail}>`,
    to: [email],
    subject: content.subject,
    html: fullHtml,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email. Please try again.' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
