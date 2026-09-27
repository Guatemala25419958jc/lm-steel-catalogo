# LM Steel Designs — independent catalogue demo

Reuses the section structure and in-page collection navigation of ELTAYER. No changes to ELTAYER or Stahlé. All photographs and the logo came from the supplied LM_STEEL_DESIGNS.zip. Four collections, three demo products each. No commerce, database or login.

## Local and Vercel
Node 22: `npm run dev` opens the app on http://localhost:3002. `npm test` checks data and the email handler without sending any email. `npm run build` generates dist. Import this repository into a new Vercel project with **Other** preset. Build command: `npm run build`; output: `dist`. The root `api/leads.js` is a Vercel Node function.

## Email setup — required before enabling real leads
The form posts to `/api/leads`, not mailto. Until configuration exists, it responds with HTTP 503 and an honest unavailable message plus a working WhatsApp alternative; it never claims success.

1. Configure a Resend account and verify a sender domain you control.
2. Add `RESEND_API_KEY` and `LEAD_FROM_EMAIL` in this new project's Vercel environment variables. The sender must be on your verified domain. Do not commit keys.
3. Redeploy and perform a consented delivery test. Requests go only to `Lmsteeldesigns@gmail.com`, with the visitor as Reply-To. Email includes all six fields, consent and a UTC submission timestamp.
4. Enable suitable Vercel Firewall rate limiting/bot protection before opening the email service to public traffic. The endpoint validates origin, content type, length, field values, consent and a honeypot. These controls do not replace distributed abuse protection. Resend idempotency keys prevent duplicate delivery on a retry of the same request.

No actual email delivery has been verified without credentials. Tests mock the provider and do not contact LM Steel Designs.

## Editing
`catalog.js`: collections, products, captions, images and WhatsApp number `96170373280`. `index.html`: editorial content, official Instagram, phone and email. `styles.css`: charcoal/steel design and motion; respects reduced-motion preference. `app.js`: catalogue, menu, animation and lead form behaviour.

Pergolas / structures use explicitly labelled reference details from real supplied work, as approved. The Architectural Windows image is also labelled as a glazed-door framing reference. These are demo service descriptions, not technical specifications or certification claims.

Email integration documentation: https://resend.com/docs/api-reference/emails/send-email
