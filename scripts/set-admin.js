/**
 * One-time script: sets super_admin role for the owner account.
 * Run with: node scripts/set-admin.js
 */
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const TARGET_EMAIL = 'johnathan.mericamarketing@gmail.com';

async function run() {
  const db = admin.firestore();
  const auth = admin.auth();

  // Lookup Firebase UID by email
  const user = await auth.getUserByEmail(TARGET_EMAIL);
  console.log(`Found user: ${user.uid} (${user.email})`);

  // Update or create their profile with super_admin role
  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    role: 'super_admin',
    plan: 'byok',
    updated_at: new Date().toISOString(),
  }, { merge: true });

  console.log(`✅ ${TARGET_EMAIL} is now super_admin!`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
