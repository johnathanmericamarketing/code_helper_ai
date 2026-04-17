const admin = require('firebase-admin');
const sa = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(sa),
  projectId: sa.project_id,
});

const TARGET_EMAIL = 'johnathan.mericamarketing@gmail.com';

async function run() {
  const db = admin.firestore();
  const auth = admin.auth();

  const user = await auth.getUserByEmail(TARGET_EMAIL);
  console.log(`Found user: ${user.uid} (${user.email})`);

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
