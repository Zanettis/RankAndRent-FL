export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const SITE_NAME = 'Gulf Blvd Screen Repair';
const FROM_DEFAULT = 'leads@gulfblvdrescreening.com';

const EMAIL_CONTENT: Record<string, { subject: string; html: string }> = {
  'hurricane-checklist': {
    subject: 'Your Pool Cage Hurricane Readiness Checklist',
    html: `
<h2>Pool Cage Hurricane Readiness Checklist</h2>
<p>Gulf Blvd Screen Repair — Pre-Storm Inspection Guide</p>
<h3>🔍 Screen Inspection (Do 2 weeks before storm season)</h3>
<ul>
<li>□ Check all screen panels for tears, holes, or bubbling mesh</li>
<li>□ Look for separated screen from spline channel (edges lifting)</li>
<li>□ Check every corner — these fail first in wind</li>
<li>□ Inspect pet-screen panels separately (higher tension = more stress)</li>
</ul>
<h3>🔩 Fastener &amp; Frame Inspection</h3>
<ul>
<li>□ Press each visible screw head — rust softens metal, heads snap under load</li>
<li>□ Check for orange rust streaks running down frame rails</li>
<li>□ Inspect vertical frame posts for bowing or leaning</li>
<li>□ Verify door hinges move freely, latches engage fully</li>
</ul>
<h3>📋 When to Call a Pro (Don't DIY These)</h3>
<ul>
<li>□ Any frame section that flexes more than 1 inch under hand pressure</li>
<li>□ Rust penetrating more than 30% of any screw or fastener</li>
<li>□ Screen panels with tears longer than 6 inches (won't survive 50+ mph winds)</li>
<li>□ Door that doesn't latch — becomes a projectile in high wind</li>
</ul>
<h3>📸 Insurance Documentation (Do Before Every Storm)</h3>
<ul>
<li>□ Photograph entire pool cage from all 4 corners</li>
<li>□ Close-up photos of any pre-existing damage</li>
<li>□ Date-stamp all photos</li>
<li>□ Send to email/cloud storage immediately</li>
</ul>
<p><strong>Need a pre-season inspection?</strong> Call us: <a href="tel:(727)555-0100">(727) 555-0100</a> | <a href="https://gulfblvdrescreening.com/contact">Request free estimate</a></p>
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
