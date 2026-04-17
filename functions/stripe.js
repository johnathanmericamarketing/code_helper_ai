const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// ─── Helper: get user profile ─────────────────────────────────────────────────
async function getOrCreateStripeCustomer(uid, email) {
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const user = userDoc.data();

  if (user.stripe_customer_id) return user.stripe_customer_id;

  // TODO: Create actual Stripe customer when key is configured
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const customer = await stripe.customers.create({ email, metadata: { firebaseUid: uid } });
  // await userRef.update({ stripe_customer_id: customer.id });
  // return customer.id;

  // FRAMEWORK STUB: return placeholder
  const stubId = `cus_stub_${uid.slice(0, 8)}`;
  await userRef.update({ stripe_customer_id: stubId });
  return stubId;
}

// ─── createCheckoutSession: Start Stripe subscription checkout ────────────────
exports.createCheckoutSession = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be logged in");

  const { priceId, successUrl, cancelUrl } = request.data;
  const uid = request.auth.uid;
  const userDoc = await db.collection("users").doc(uid).get();
  const email = userDoc.data()?.email || "";

  // FRAMEWORK STUB: Return a placeholder message until Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      mode: "stub",
      message: "Stripe is not yet configured. Add STRIPE_SECRET_KEY to Firebase Functions config to enable real billing.",
      // In live mode, this would return: { url: session.url }
    };
  }

  // LIVE MODE (uncomment when Stripe key is ready):
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const customerId = await getOrCreateStripeCustomer(uid, email);
  // const session = await stripe.checkout.sessions.create({
  //   customer: customerId,
  //   payment_method_types: ['card'],
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   mode: 'subscription',
  //   success_url: successUrl,
  //   cancel_url: cancelUrl,
  //   metadata: { firebaseUid: uid },
  // });
  // return { url: session.url };
});

// ─── createPortalSession: Let subscribed users manage/cancel billing ──────────
exports.createPortalSession = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be logged in");

  const { returnUrl } = request.data;
  const uid = request.auth.uid;
  const userDoc = await db.collection("users").doc(uid).get();
  const customerId = userDoc.data()?.stripe_customer_id;

  if (!customerId || !process.env.STRIPE_SECRET_KEY) {
    return {
      mode: "stub",
      message: "Stripe is not yet configured. No portal session can be created.",
    };
  }

  // LIVE MODE:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
  // return { url: session.url };
});

// ─── stripeWebhook: Receive Stripe events and update Firestore ────────────────
exports.stripeWebhook = onRequest(async (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.log("Stripe not configured — webhook received but ignored");
    res.status(200).send("Stripe not configured");
    return;
  }

  // LIVE MODE:
  // const stripe = require('stripe')(stripeKey);
  // const sig = req.headers['stripe-signature'];
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  // } catch (err) {
  //   res.status(400).send(`Webhook Error: ${err.message}`);
  //   return;
  // }
  //
  // switch (event.type) {
  //   case 'checkout.session.completed': {
  //     const session = event.data.object;
  //     const uid = session.metadata.firebaseUid;
  //     await db.collection('users').doc(uid).update({
  //       plan: 'platform',
  //       stripe_subscription_id: session.subscription,
  //       stripe_customer_id: session.customer,
  //     });
  //     break;
  //   }
  //   case 'customer.subscription.deleted': {
  //     const sub = event.data.object;
  //     const snap = await db.collection('users').where('stripe_subscription_id', '==', sub.id).get();
  //     snap.docs[0]?.ref.update({ plan: 'free', stripe_subscription_id: null });
  //     break;
  //   }
  // }

  res.status(200).send("OK");
});
