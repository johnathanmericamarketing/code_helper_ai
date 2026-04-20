# Code Helper Studio — Demo Account Setup Guide

> This document covers everything needed to create and maintain a demo account that visitors can use to try out **Code Helper Studio** at `codehelper.studio`. It covers two systems that must be wired together: **FastMoose (WHMCS)** for hosting provisioning and **Firebase Auth + Firestore** for the app account itself.

---

## Table of Contents

- [Overview — Two Systems, One Demo](#overview--two-systems-one-demo)
- [Part 1 — Firebase Demo Account](#part-1--firebase-demo-account)
  - [Step 1: Create the Firebase Auth User (Admin SDK)](#step-1-create-the-firebase-auth-user-admin-sdk)
  - [Step 2: Create the Firestore User Document](#step-2-create-the-firestore-user-document)
  - [Step 3: Demo Account Firestore Schema](#step-3-demo-account-firestore-schema)
  - [Step 4: Lock Down the Demo Account](#step-4-lock-down-the-demo-account)
  - [Step 5: Add Security Rules for Demo Role](#step-5-add-security-rules-for-demo-role)
- [Part 2 — FastMoose (WHMCS) Hosting Account](#part-2--fastmoose-whmcs-hosting-account)
  - [WHMCS API Authentication](#whmcs-api-authentication)
  - [Step 1: Get Your Product IDs](#step-1-get-your-product-ids)
  - [Step 2: Create the Demo Client Account](#step-2-create-the-demo-client-account)
  - [Step 3: Create an Order for the Hosting Product](#step-3-create-an-order-for-the-hosting-product)
  - [Step 4: Activate / Provision the Hosting Account](#step-4-activate--provision-the-hosting-account)
- [Part 3 — Demo Account Reset Script](#part-3--demo-account-reset-script)
- [Part 4 — Recommended Demo UX Patterns](#part-4--recommended-demo-ux-patterns)
- [Environment Variables Needed](#environment-variables-needed)
- [API Reference Quick-Card](#api-reference-quick-card)

---

## Overview — Two Systems, One Demo

Code Helper Studio uses two separate systems that both need a demo account:

| System | Purpose | Platform |
|---|---|---|
| **Firebase Auth** | App login — who can sign in to `codehelper.studio` | Firebase (Google) |
| **Firestore `users` collection** | App profile — plan, role, token limits, API key | Firestore (Google) |
| **FastMoose / WHMCS** | Web hosting account for the demo environment | WHMCS at `my.fastmoose.com` |

The **demo visitor flow** works like this:

1. Visitor lands on `codehelper.studio`
2. Clicks "Try Demo" → logs in with shared demo credentials
3. Firebase Auth validates → loads Firestore profile with `role: demo`
4. App shows limited/sandboxed experience
5. Demo data resets on a schedule (or on each login)

---

## Part 1 — Firebase Demo Account

### Step 1: Create the Firebase Auth User (Admin SDK)

Run this once from your local machine or as a Cloud Function. Requires your `service-account.json`.

```js
// scripts/create-demo-account.js
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'code-helper-studio',
});

const DEMO_EMAIL    = 'demo@codehelper.studio';
const DEMO_PASSWORD = 'TryCodeHelper2026!';  // Change this — make it strong enough to not get guessed
const DEMO_UID      = 'demo-user-001';       // Fixed UID makes reset scripts simpler

async function createDemoUser() {
  const auth = admin.auth();

  try {
    // Check if demo user already exists
    const existing = await auth.getUserByEmail(DEMO_EMAIL);
    console.log(`Demo user already exists: ${existing.uid}`);
    return existing;
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err;
  }

  // Create with a fixed UID so Firestore doc path is predictable
  const user = await auth.createUser({
    uid:           DEMO_UID,
    email:         DEMO_EMAIL,
    emailVerified: true,          // Skip email verification for demo
    password:      DEMO_PASSWORD,
    displayName:   'Demo User',
    disabled:      false,
  });

  console.log(`✅ Demo user created: ${user.uid}`);
  return user;
}

createDemoUser().catch(console.error);
```

Run it:

```bash
node scripts/create-demo-account.js
```

---

### Step 2: Create the Firestore User Document

After the Auth user exists, create (or reset) the matching Firestore profile:

```js
// scripts/create-demo-account.js (continued, add below createDemoUser call)
async function createDemoFirestoreProfile(uid) {
  const db = admin.firestore();

  const demoProfile = {
    uid:               uid,
    email:             DEMO_EMAIL,
    displayName:       'Demo User',
    role:              'demo',         // Custom role — not super_admin, not byok
    plan:              'demo',
    apiKeyConfigured:  false,          // Demo uses a pre-set sandboxed key or none
    demo_api_key:      '',             // Optionally pre-load a rate-limited Claude key here

    // Token/cost caps — keep these tight so demo can't rack up real costs
    monthly_token_limit:   10000,      // 10k tokens max per month
    monthly_tokens_used:   0,
    monthly_cost_usd:      0.00,
    monthly_request_count: 0,

    // Feature flags — control what demo users can see/do
    features: {
      create_request:    true,
      view_projects:     true,
      view_versions:     true,
      admin_panel:       false,        // No admin access
      connections_page:  false,        // No external connections
      billing:           false,
      export:            false,
    },

    // Limits
    max_requests_per_day:  5,          // Show the product, not unlimited access
    max_projects:          2,

    // Notifications off for demo
    notifications: {
      email:   false,
      browser: false,
    },

    // Auto-approve low-risk actions (makes demo feel fast)
    auto_approve_low_risk: true,

    // Timestamps
    created_at:    admin.firestore.FieldValue.serverTimestamp(),
    last_reset_at: admin.firestore.FieldValue.serverTimestamp(),
    is_demo:       true,               // Flag makes it easy to query/filter
  };

  await db.collection('users').doc(uid).set(demoProfile, { merge: false });
  console.log(`✅ Firestore demo profile created for ${uid}`);
}

// Run both
async function main() {
  const user = await createDemoUser();
  await createDemoFirestoreProfile(user.uid);
  process.exit(0);
}

main().catch(console.error);
```

---

### Step 3: Demo Account Firestore Schema

```
users/demo-user-001/
  uid:                   "demo-user-001"
  email:                 "demo@codehelper.studio"
  displayName:           "Demo User"
  role:                  "demo"
  plan:                  "demo"
  is_demo:               true
  apiKeyConfigured:      false
  demo_api_key:          ""              ← optional: pre-loaded sandboxed key
  monthly_token_limit:   10000
  monthly_tokens_used:   0
  monthly_cost_usd:      0.00
  monthly_request_count: 0
  max_requests_per_day:  5
  max_projects:          2
  auto_approve_low_risk: true
  features: {
    create_request:   true
    view_projects:    true
    view_versions:    true
    admin_panel:      false
    connections_page: false
    billing:          false
    export:           false
  }
  notifications: { email: false, browser: false }
  created_at:    <timestamp>
  last_reset_at: <timestamp>
```

---

### Step 4: Lock Down the Demo Account

Key protections to put in place so demo users can't do real damage:

**A — Prevent demo user from changing email/password (Admin SDK)**

```js
// Call this after creating the demo user to disable self-service credential changes
await admin.auth().updateUser(DEMO_UID, {
  // emailVerified stays true
  // disabled stays false so they can log in
  // But in your app, gate the "Change Password" and "Change Email" UI routes
  // by checking role !== 'demo'
});
```

**B — In your React app, gate sensitive actions by role**

```jsx
// In any component that should be blocked for demo users
const { userProfile } = useContext(AuthContext); // or however you load Firestore profile

if (userProfile?.role === 'demo') {
  return (
    <DemoBanner message="Upgrade to use this feature — Try it free with your own API key" />
  );
}
```

**C — Rate-limit at the Cloud Function level**

In `functions/claude.js` (where Claude API calls are made), add a demo check:

```js
// At the top of your callable function
const uid = context.auth?.uid;
const userDoc = await admin.firestore().collection('users').doc(uid).get();
const profile = userDoc.data();

if (profile.is_demo) {
  if (profile.monthly_request_count >= 5) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Demo limit reached. Sign up for full access.'
    );
  }
  // Increment counter
  await userDoc.ref.update({
    monthly_request_count: admin.firestore.FieldValue.increment(1),
  });
}
```

---

### Step 5: Add Security Rules for Demo Role

Update `firestore.rules` to prevent demo users from writing to their own profile (so they can't self-promote their role):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      // Normal users: full read/write their own doc
      allow read: if request.auth != null && request.auth.uid == userId;

      // Super admins: read all users
      allow read: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';

      // Write: allowed for own doc UNLESS demo user (demo users cannot modify their profile)
      allow write: if request.auth != null
        && request.auth.uid == userId
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role != 'demo';

      // Super admins can write to any user doc (for resets)
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }

    match /{document=**} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Part 2 — FastMoose (WHMCS) Hosting Account

FastMoose runs **WHMCS** as its client/billing portal at `my.fastmoose.com`. Their hosting control panel (HCP) is at `cp.okyanust.com`. All account provisioning goes through the WHMCS API.

### WHMCS API Authentication

**Base API URL:**

```
https://my.fastmoose.com/includes/api.php
```

**Auth method:** API Identifier + Secret (generated in WHMCS admin area)

```
Admin Area → Configuration → Manage API Credentials → Generate New Credential
```

Every API call requires these fields in the POST body:

```php
$identifier = 'YOUR_API_IDENTIFIER';   // Generated in WHMCS admin
$secret     = 'YOUR_API_SECRET';       // Generated in WHMCS admin

$base_params = [
  'identifier'   => $identifier,
  'secret'       => $secret,
  'responsetype' => 'json',
  'action'       => '',  // Set per call
];
```

> **Important:** The admin user attached to your API credentials must have "API Access" permission enabled in their admin role group.

---

### Step 1: Get Your Product IDs

Before creating any orders, find the `pid` (Product ID) for the hosting plan you want to attach to the demo account.

```php
// get-products.php — run once to see your available plans
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://my.fastmoose.com/includes/api.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
  'identifier'   => 'YOUR_API_IDENTIFIER',
  'secret'       => 'YOUR_API_SECRET',
  'action'       => 'GetProducts',
  'responsetype' => 'json',
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Print all products with their IDs and names
foreach ($response['products']['product'] as $product) {
  echo "PID: {$product['pid']} | Name: {$product['name']} | Type: {$product['type']}\n";
}
```

Save the `pid` value for the plan you want to use for the demo. You'll use it in the next step.

---

### Step 2: Create the Demo Client Account

```php
// create-demo-client.php
function whmcs_api($action, $params) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'https://my.fastmoose.com/includes/api.php');
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array_merge([
    'identifier'   => 'YOUR_API_IDENTIFIER',
    'secret'       => 'YOUR_API_SECRET',
    'responsetype' => 'json',
    'action'       => $action,
  ], $params)));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  return $response;
}

// Create the demo client in WHMCS
$result = whmcs_api('AddClient', [
  'firstname'   => 'Demo',
  'lastname'    => 'User',
  'email'       => 'demo@codehelper.studio',   // Match Firebase demo email
  'companyname' => 'Code Helper Studio Demo',
  'address1'    => '123 Demo Street',
  'city'        => 'Canyon Lake',
  'state'       => 'California',
  'postcode'    => '92587',
  'country'     => 'US',
  'phonenumber' => '800-555-0100',
  'password2'   => 'TryCodeHelper2026!',        // Client portal password
  'notes'       => 'DEMO ACCOUNT — Do not delete. Auto-provisioned.',
  'noemail'     => true,                        // Don't send welcome email to demo account
]);

if ($result['result'] === 'success') {
  $client_id = $result['clientid'];
  echo "✅ Demo client created. Client ID: {$client_id}\n";
} else {
  echo "❌ Error: {$result['message']}\n";
}
```

---

### Step 3: Create an Order for the Hosting Product

```php
// Replace 999 with the actual pid from Step 1
// Replace $client_id with the ID returned from Step 2

$DEMO_CLIENT_ID  = $client_id;        // From Step 2 response
$HOSTING_PLAN_PID = 999;              // Replace with real pid from GetProducts
$DEMO_DOMAIN     = 'demo.codehelper.studio';

$order = whmcs_api('AddOrder', [
  'clientid'      => $DEMO_CLIENT_ID,
  'paymentmethod' => 'mailin',         // No payment needed — we'll set $0 price
  'pid'           => [$HOSTING_PLAN_PID],
  'domain'        => [$DEMO_DOMAIN],
  'billingcycle'  => ['monthly'],
  'priceoverride' => [0.00],           // Override price to $0 for demo
  'noinvoice'     => true,             // No invoice generated
  'noinvoiceemail'=> true,
  'noemail'       => true,
]);

if ($order['result'] === 'success') {
  $order_id   = $order['orderid'];
  $service_id = $order['serviceids'];
  echo "✅ Order created. Order ID: {$order_id} | Service ID: {$service_id}\n";
} else {
  echo "❌ Order error: {$order['message']}\n";
}
```

---

### Step 4: Activate / Provision the Hosting Account

```php
// After AddOrder — explicitly accept and provision
$activate = whmcs_api('AcceptOrder', [
  'orderid'   => $order_id,    // From Step 3 response
  'autosetup' => true,         // Tells WHMCS to provision the hosting account
  'sendemail' => false,        // Don't email the demo account
]);

if ($activate['result'] === 'success') {
  echo "✅ Hosting account provisioned!\n";
  echo "Demo URL: https://{$DEMO_DOMAIN}\n";
  echo "HCP: https://cp.okyanust.com\n";
} else {
  echo "❌ Activation error: {$activate['message']}\n";
}
```

**Full 3-step sequence summarized:**

```
GetProducts  →  note the pid for your demo plan
AddClient    →  get clientid back
AddOrder     →  pass clientid + pid, get orderid back
AcceptOrder  →  pass orderid, autosetup=true → hosting account provisioned
```

---

## Part 3 — Demo Account Reset Script

Run this on a schedule (daily cron, or on each demo login) to wipe demo data and restore defaults. This prevents one visitor's demo session from affecting the next person's experience.

```js
// scripts/reset-demo-account.js
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'code-helper-studio',
});

const DEMO_UID = 'demo-user-001';

async function resetDemoAccount() {
  const db  = admin.firestore();
  const ref = db.collection('users').doc(DEMO_UID);

  // 1 — Reset Firestore profile counters
  await ref.update({
    monthly_tokens_used:   0,
    monthly_cost_usd:      0.00,
    monthly_request_count: 0,
    last_reset_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('✅ Firestore profile reset');

  // 2 — Delete any demo projects created by this user
  const projects = await db.collection('projects')
    .where('userId', '==', DEMO_UID)
    .get();

  const batch = db.batch();
  projects.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`✅ Deleted ${projects.size} demo project(s)`);

  // 3 — Optionally re-enable the account if it was disabled
  await admin.auth().updateUser(DEMO_UID, { disabled: false });
  console.log('✅ Demo auth account re-enabled');

  process.exit(0);
}

resetDemoAccount().catch(console.error);
```

**Run on a schedule via cron or Cloud Scheduler:**

```bash
# Run reset every night at midnight Pacific
node scripts/reset-demo-account.js
```

Or deploy as a Firebase Scheduled Function:

```js
// functions/index.js — add this scheduled function
const { onSchedule } = require('firebase-functions/v2/scheduler');

exports.resetDemoAccount = onSchedule('every 24 hours', async () => {
  const db  = admin.firestore();
  const ref = db.collection('users').doc('demo-user-001');

  await ref.update({
    monthly_tokens_used:   0,
    monthly_cost_usd:      0.00,
    monthly_request_count: 0,
    last_reset_at:         admin.firestore.FieldValue.serverTimestamp(),
  });

  // Delete demo projects
  const projects = await db.collection('projects')
    .where('userId', '==', 'demo-user-001')
    .get();
  const batch = db.batch();
  projects.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
});
```

---

## Part 4 — Recommended Demo UX Patterns

### Credentials to display on the landing page

```
Email:    demo@codehelper.studio
Password: TryCodeHelper2026!
```

Or wire up a **"Try Demo"** button that auto-signs in without showing credentials:

```jsx
// In LandingPage.jsx — single click demo login
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

async function handleDemoLogin() {
  await signInWithEmailAndPassword(
    auth,
    'demo@codehelper.studio',
    'TryCodeHelper2026!'
  );
  navigate('/studio');  // or wherever the main app UI is
}

<button onClick={handleDemoLogin} className="btn-demo">
  Try the Demo — No signup needed
</button>
```

### Demo banner component

Show a persistent banner inside the app when a demo user is logged in:

```jsx
// components/DemoBanner.jsx
export function DemoBanner() {
  return (
    <div className="demo-banner">
      You're in demo mode — 5 requests available.{' '}
      <a href="/auth?mode=signup">Sign up free with your own API key →</a>
    </div>
  );
}

// In App.js layout:
{userProfile?.role === 'demo' && <DemoBanner />}
```

### What to show vs. hide in demo mode

| Feature | Demo Access | Notes |
|---|---|---|
| Create Request | Yes (max 5) | Core selling point — show it |
| Visual Inspector | Yes | Core demo feature per your landing copy |
| View Projects | Yes (max 2 seeded) | Pre-seed 2 example projects |
| View Versions | Yes | Let them see the version diff |
| Admin Panel | No | Hide the route entirely |
| Connections Page | No | No external integrations in demo |
| Settings / API Key | Read-only | Show the field, disable save |
| Billing / Upgrade | Yes — CTA | Always show the upgrade path |
| Export | No | Gated feature |

### Pre-seed demo projects

Run this once (or on reset) to give demo users something real to look at:

```js
// scripts/seed-demo-projects.js
const projects = [
  {
    userId:      'demo-user-001',
    name:        'Example: E-commerce Product Page',
    description: 'Sample project showing Code Helper Studio in action',
    created_at:  new Date(),
    is_demo_seed: true,
  },
  {
    userId:      'demo-user-001',
    name:        'Example: Auth Flow Refactor',
    description: 'See how precise element targeting works',
    created_at:  new Date(),
    is_demo_seed: true,
  },
];

for (const project of projects) {
  await db.collection('projects').add(project);
}
```

---

## Environment Variables Needed

Add these to your `.env` / Cloud Function config — never commit to GitHub:

```bash
# Firebase Admin (already in use for set-admin.js)
SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account.json

# Demo account credentials (used in reset/create scripts)
DEMO_EMAIL=demo@codehelper.studio
DEMO_PASSWORD=TryCodeHelper2026!
DEMO_UID=demo-user-001

# WHMCS API (FastMoose)
WHMCS_API_URL=https://my.fastmoose.com/includes/api.php
WHMCS_IDENTIFIER=YOUR_API_IDENTIFIER
WHMCS_SECRET=YOUR_API_SECRET
WHMCS_DEMO_CLIENT_ID=      # Fill in after running AddClient
WHMCS_DEMO_PLAN_PID=       # Fill in after running GetProducts
WHMCS_DEMO_DOMAIN=demo.codehelper.studio
```

---

## API Reference Quick-Card

### Firebase Auth REST API (Identity Toolkit)

| Action | Method | Endpoint |
|---|---|---|
| Create user | POST | `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]` |
| Sign in | POST | `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]` |
| Update user | POST | `https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]` |
| Disable user | Via Admin SDK `updateUser(uid, { disabled: true })` | — |

### Firebase Admin SDK — Key Methods

```js
admin.auth().createUser({ uid, email, password, emailVerified, disabled })
admin.auth().updateUser(uid, { disabled, password, displayName })
admin.auth().getUserByEmail(email)
admin.auth().deleteUser(uid)
admin.firestore().collection('users').doc(uid).set(data, { merge: true })
admin.firestore().collection('users').doc(uid).update(data)
```

### WHMCS API — Key Endpoints

| Action | `action` value | Key params |
|---|---|---|
| List hosting products | `GetProducts` | `pid` (optional filter) |
| Create client | `AddClient` | `firstname`, `lastname`, `email`, `address1`, `city`, `state`, `postcode`, `country`, `phonenumber` |
| Create order | `AddOrder` | `clientid`, `paymentmethod`, `pid[]`, `domain[]`, `billingcycle[]`, `priceoverride[]` |
| Activate/provision | `AcceptOrder` | `orderid`, `autosetup=true`, `sendemail=false` |

**All WHMCS calls POST to:**

```
https://my.fastmoose.com/includes/api.php
```

**Auth fields required on every call:**

```
identifier = YOUR_API_IDENTIFIER
secret     = YOUR_API_SECRET
responsetype = json
```

---

*Sources: [WHMCS AddClient API](https://developers.whmcs.com/api-reference/addclient/) · [WHMCS AddOrder API](https://developers.whmcs.com/api-reference/addorder/) · [WHMCS AcceptOrder API](https://developers.whmcs.com/api-reference/acceptorder/) · [WHMCS GetProducts API](https://developers.whmcs.com/api-reference/getproducts/) · [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth) · [Firebase Admin SDK — Manage Users](https://firebase.google.com/docs/auth/admin/manage-users)*
