# UniTrade E-commerce Application

A modern e-commerce platform built with Next.js, Sanity CMS, and Stripe.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file based on `.env.example` and fill in your environment variables
4. Run the development server:
   ```
   npm run dev
   ```

## Setting Up Stripe Webhooks Locally

We've provided a custom PowerShell script that simplifies testing Stripe webhooks locally.

### Prerequisites

1. Ensure you have your Stripe API keys set in `.env.local`
2. Make sure the development server is running (`npm run dev`)

### Using the Webhook Testing Script

1. First, start the webhook listener in a separate terminal:
   ```
   .\stripe-webhook-test.ps1 listen
   ```
   This will start forwarding Stripe webhook events to your local server.
   
   **Important**: Copy the webhook signing secret displayed in the output and add it to your `.env.local` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. In another terminal, trigger test events:
   ```
   .\stripe-webhook-test.ps1 trigger
   ```
   This will send a test `checkout.session.completed` event to your webhook endpoint.

3. For help and other commands:
   ```
   .\stripe-webhook-test.ps1 help
   ```

### What Happens When a Webhook is Received

1. When a `checkout.session.completed` event is received, the app creates an order record
2. The order details are stored in memory (would be in a database in production)
3. Orders can be viewed on the `/orders` page when logged in

### Webhook Events Handled

The application processes the following Stripe webhook events:

- `checkout.session.completed`: Triggered when a customer completes the checkout process
- `payment_intent.succeeded`: Triggered when a payment is successful

## Manual Stripe CLI Setup

If you prefer to use the Stripe CLI directly:

1. **Install the Stripe CLI**:
   - Download from [https://github.com/stripe/stripe-cli/releases/latest](https://github.com/stripe/stripe-cli/releases/latest)
   - Extract the zip file and run the stripe.exe executable

2. **Start the webhook forwarding**:
   ```
   .\stripe.exe listen --api-key YOUR_STRIPE_SECRET_KEY --forward-to http://localhost:3000/api/webhook
   ```

3. **Copy the webhook signing secret**:
   When you start the webhook forwarding, Stripe CLI will display a webhook signing secret. Add this to your `.env.local` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Testing webhooks**:
   You can trigger test webhook events using:
   ```
   .\stripe.exe trigger checkout.session.completed --api-key YOUR_STRIPE_SECRET_KEY
   ```

## Additional Resources

- [Stripe Webhook Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
