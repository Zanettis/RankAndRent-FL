export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const SITE_NAME = 'Gulf Blvd Landscaping';
const FROM_DEFAULT = 'leads@gulfblvdlandscape.com';

const EMAIL_CONTENT: Record<string, { subject: string; html: string }> = {
  'lawn-calendar': {
    subject: 'Your Gulf Coast Seasonal Lawn & Plant Care Calendar',
    html: `
<h2>Gulf Coast Seasonal Lawn &amp; Plant Care Calendar</h2>
<p>Gulf Blvd Landscaping — Pinellas County, FL</p>
<h3>📅 Monthly Tasks for Gulf Coast Properties</h3>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
<tr><th>Month</th><th>Lawn</th><th>Plants</th><th>Irrigation</th></tr>
<tr><td>Jan–Feb</td><td>Mow at 3.5–4" (St. Augustine dormant growth)</td><td>Best time to plant trees, shrubs</td><td>2x/week max (SWFWMD Phase 2)</td></tr>
<tr><td>March</td><td>First fertilizer app (slow-release 15-0-15)</td><td>Plant warm-season annuals</td><td>Increase if no rain 5+ days</td></tr>
<tr><td>April</td><td>Pre-emergent weed control</td><td>Bougainvillea pruning (post-bloom)</td><td>3x/week (SWFWMD Phase 1)</td></tr>
<tr><td>May–June</td><td>Second fertilizer app (high nitrogen)</td><td>Hurricane season prep: stake new plants</td><td>3x/week; rain sensor required</td></tr>
<tr><td>July–Aug</td><td>Watch for chinch bugs (yellowing in hot spots)</td><td>Avoid planting in peak heat</td><td>3x/week — skip after 0.5"+ rain</td></tr>
<tr><td>Sept–Oct</td><td>Third fertilizer (0-0-22 potassium only)</td><td>Post-storm: flush salt with fresh water</td><td>Reduce to 2x/week after Aug 31</td></tr>
<tr><td>Nov–Dec</td><td>Final mow at 4" before dormancy</td><td>Plant cold-sensitive tropicals by Nov 15</td><td>1x/week or less (SWFWMD Phase 2)</td></tr>
</table>
<h3>🌊 After a Storm: Salt Flush Protocol</h3>
<ul>
<li>Within 24 hours: run irrigation for 30+ minutes to flush salt spray from leaves and soil</li>
<li>Check for spray-burned foliage (brown tips) — don't prune immediately, wait 2 weeks</li>
<li>Bougainvillea and Ixora are salt-sensitive — extra flush needed</li>
</ul>
<p><strong>Need help with your lawn or landscape?</strong> <a href="https://gulfblvdlandscape.com/contact">Request free estimate</a> | <a href="tel:(727)555-0400">(727) 555-0400</a></p>
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
