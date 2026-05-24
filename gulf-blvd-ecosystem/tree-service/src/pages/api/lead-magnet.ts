export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const SITE_NAME = 'Gulf Blvd Tree Experts';
const FROM_DEFAULT = 'leads@gulfblvdtreeexperts.com';

const EMAIL_CONTENT: Record<string, { subject: string; html: string }> = {
  'hurricane-tree-guide': {
    subject: 'Your Gulf Coast Hurricane Tree Prep Guide',
    html: `
<h2>Gulf Coast Hurricane Tree Prep Guide</h2>
<p>Gulf Blvd Tree Experts — ISA-Certified Arborists</p>
<h3>🌴 Risk Assessment by Species (Gulf Blvd Common Trees)</h3>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
<tr><th>Species</th><th>Hurricane Risk</th><th>Action Needed</th></tr>
<tr><td>Sabal Palm (State Tree)</td><td>LOW — flexible trunk</td><td>Remove dead fronds only (6–8 fronds above horizontal)</td></tr>
<tr><td>Live Oak</td><td>MEDIUM — strong but dense canopy</td><td>Crown thin 15–20% to reduce wind resistance</td></tr>
<tr><td>Laurel Oak</td><td>HIGH — shallow roots, brittle branches</td><td>Annual crown reduction + inspect for decay</td></tr>
<tr><td>Australian Pine (invasive)</td><td>VERY HIGH — snaps at base</td><td>Consider removal before storm season</td></tr>
<tr><td>Sea Grape</td><td>LOW — native, wind-adapted</td><td>Light pruning only; don't over-trim</td></tr>
</table>
<h3>📅 Pre-Season Timeline (May 1 = Hurricane Season Start)</h3>
<ul>
<li><strong>March–April:</strong> Schedule ISA arborist inspection ($150–300, credited toward work)</li>
<li><strong>April:</strong> Complete any crown reduction or structural pruning</li>
<li><strong>Late April:</strong> Remove dead wood, hanging branches, co-dominant stems</li>
<li><strong>May 1+:</strong> No major pruning (open wounds + storm stress = disease risk)</li>
</ul>
<h3>🚨 Emergency Contacts to Save Now</h3>
<ul>
<li>Our 24/7 emergency line: <a href="tel:(727)555-0326">(727) 555-0326</a></li>
<li>Pinellas County Emergency Management: (727) 464-3800</li>
<li>FPL downed power line: 1-800-226-4545</li>
<li>Duke Energy downed line: 1-800-228-8485</li>
</ul>
<p><strong>Book your pre-season inspection:</strong> <a href="https://gulfblvdtreeexperts.com/contact">Schedule here</a></p>
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
