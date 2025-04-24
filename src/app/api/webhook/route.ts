import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { client } from "@/sanity/lib/backendClient";

// This is a test endpoint just for debugging
export async function GET(req: NextRequest) {
  try {
    const testOrder = {
      _type: 'order',
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      checkoutSessionId: `test_cs_${Date.now()}`,
      customerId: 'test_customer',
      paymentIntent: `test_pi_${Date.now()}`,
      product: [
        {
          _key: Date.now().toString(),
          quantity: 1,
          product: {
            _type: 'reference',
            _ref: 'test_product_id' // Would be a real product ID in production
          }
        }
      ],
      totalPrice: 99.99,
      currency: 'inr',
      amountDiscount: 0,
      status: 'Pending',
      orderDate: new Date().toISOString()
    };
    
    // Create test order in Sanity
    const result = await client.create(testOrder);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test order created in Sanity', 
      order: result 
    });
  } catch (error) {
    console.error('Error in webhook test:', error);
    return NextResponse.json({ error: 'Error creating test order' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log("Webhook received:", event.type);
    
    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Checkout session completed:", session.id);
      console.log("Customer details:", session.customer_details);
      console.log("Metadata:", session.metadata);
      
      // Create order in Sanity
      await handleCheckoutSessionCompleted(session);
    } 
    else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);
      
      // You could update an existing order if needed
      // await updateOrderPaymentStatus(paymentIntent);
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Get order details from session
    const orderNumber = session.metadata?.orderNumber;
    const customerName = session.customer_details?.name || 'Unknown';
    const customerEmail = session.customer_details?.email || 'Unknown';
    
    if (!orderNumber) {
      console.error('No order number in session metadata');
      throw new Error('No order number in session metadata');
    }
    
    console.log(`Processing order ${orderNumber} for ${customerName} (${customerEmail})`);
    
    // Retrieve line items to get product details
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    });
    
    console.log(`Retrieved ${lineItems.data.length} line items`);
    
    // Map line items to Sanity product references
    const productItems = await Promise.all(lineItems.data.map(async (item) => {
      const product = item.price?.product as Stripe.Product;
      const productId = product.metadata?.sanityId || product.id;
      
      // Create a product reference
      return {
        _key: new Date().getTime().toString() + Math.random().toString().slice(2, 8),
        quantity: item.quantity || 1,
        product: {
          _type: 'reference',
          _ref: productId // This should be the Sanity document ID
        }
      };
    }));
    
    // Create order document
    const orderDoc = {
      _type: 'order',
      orderNumber: orderNumber,
      checkoutSessionId: session.id,
      customerId: session.customer as string,
      paymentIntent: session.payment_intent as string,
      product: productItems,
      totalPrice: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'inr',
      amountDiscount: session.total_details?.amount_discount ? session.total_details.amount_discount / 100 : 0,
      status: 'Paid', // Initial status
      orderDate: new Date().toISOString()
    };
    
    // Create the order in Sanity
    const result = await client.create(orderDoc);
    
    console.log(`Order ${orderNumber} created in Sanity:`, result._id);
    
    return result;
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
} 