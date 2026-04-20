# Firebase Storage File Upload via MCP — Developer Reference

> Covers both approaches: the **official Firebase MCP server** (via `firebase-tools`) and the **community `@gannonh/firebase-mcp` server**, plus the underlying Firebase SDK patterns each one uses.
>
> Source: [Firebase MCP Server Docs](https://firebase.google.com/docs/ai-assistance/mcp-server) · [gannonh/firebase-mcp GitHub](https://github.com/gannonh/firebase-mcp) · [Firebase Storage Upload Docs](https://firebase.google.com/docs/storage/web/upload-files)

---

## Table of Contents

- [Which MCP Server Should You Use?](#which-mcp-server-should-you-use)
- [Option A — Official Firebase MCP (firebase-tools)](#option-a--official-firebase-mcp-firebase-tools)
- [Option B — Community firebase-mcp (@gannonh)](#option-b--community-firebase-mcp-gannonh)
- [Upload Methods Reference](#upload-methods-reference)
- [Storage Tools Reference](#storage-tools-reference)
- [Firebase Admin SDK — Direct Upload (Node.js)](#firebase-admin-sdk--direct-upload-nodejs)
- [Client-Side Upload (React / Web SDK)](#client-side-upload-react--web-sdk)
- [Resumable Upload with Progress Tracking](#resumable-upload-with-progress-tracking)
- [Security Rules](#security-rules)
- [Storage Folder Structure — Best Practices](#storage-folder-structure--best-practices)
- [Error Handling Reference](#error-handling-reference)
- [Environment Variables Reference](#environment-variables-reference)
- [Troubleshooting](#troubleshooting)
- [Decision Guide](#decision-guide)

---

## Which MCP Server Should You Use?

| | Official Firebase MCP | Community `@gannonh/firebase-mcp` |
|---|---|---|
| Maintained by | Google / Firebase team | Open-source community |
| Install | `firebase-tools` CLI | `npx @gannonh/firebase-mcp` |
| Auth method | Firebase CLI login (`firebase login`) | Service Account key JSON |
| Storage upload tool | `storage_get_object_download_url` (download URL only) | `storage_upload` + `storage_upload_from_url` |
| Best for | Full Firebase project management via AI | Direct file uploads from AI agents |
| Works in | Cursor, Claude Code, VS Code, Gemini CLI, Windsurf | Claude Desktop, Cursor, VS Code, Augment |
| Transport | stdio | stdio or HTTP |

**Rule of thumb:**
- Use the **official Firebase MCP** when you want your AI to manage your Firebase project (Firestore, Auth, Hosting, Rules, etc.).
- Use **`@gannonh/firebase-mcp`** when you specifically need an AI agent or MCP tool to **upload files to Firebase Storage**.

---

## Option A — Official Firebase MCP (firebase-tools)

### Prerequisites

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Log in
firebase login

# Initialize project (if not already done)
firebase init
```

### MCP Config (Claude Code)

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"],
      "disabled": false
    }
  }
}
```

### MCP Config (Cursor / VS Code)

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": [
        "-y",
        "firebase-tools@latest",
        "mcp",
        "--dir", "/absolute/path/to/your/firebase/project",
        "--only", "storage,firestore,auth"
      ]
    }
  }
}
```

> `--dir` sets the project root (where `firebase.json` lives).
> `--only` limits which tool categories activate — keeps the tool list clean.

### Config File Locations by Client

| MCP Client | Config File Path |
|---|---|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Code | Project `.mcp.json` or global MCP config |
| Cursor | `[project root]/.cursor/mcp.json` |
| VS Code Copilot | `~/Library/Application Support/Code/User/settings.json` |
| Firebase Studio (Interactive chat) | `.idx/mcp.json` |
| Firebase Studio (Gemini CLI) | `.gemini/settings.json` |
| Windsurf | MCP settings panel |

### Storage Tool Available (Official Firebase MCP)

```
storage_get_object_download_url
```

> The official Firebase MCP server focuses on project management. For actual file **uploads**, use Option B below or the Admin SDK directly.

---

## Option B — Community Firebase MCP (@gannonh)

This is the **recommended choice** when your MCP agent needs to actively upload files to Firebase Storage.

### Prerequisites

```bash
# Node.js v18+
node --version

# Firebase project with Storage enabled
# Service Account key JSON downloaded from:
# Firebase Console → Project Settings → Service Accounts → Generate new private key
```

### MCP Config — npx (Recommended)

```json
{
  "firebase-mcp": {
    "command": "npx",
    "args": [
      "-y",
      "@gannonh/firebase-mcp"
    ],
    "env": {
      "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/serviceAccountKey.json",
      "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app"
    }
  }
}
```

### MCP Config — Local Installation

```bash
git clone https://github.com/gannonh/firebase-mcp.git
cd firebase-mcp
npm install
npm run build
```

```json
{
  "firebase-mcp": {
    "command": "node",
    "args": [
      "/absolute/path/to/firebase-mcp/dist/index.js"
    ],
    "env": {
      "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/serviceAccountKey.json",
      "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app"
    }
  }
}
```

### MCP Config — With Debug Logging

```json
{
  "firebase-mcp": {
    "command": "npx",
    "args": ["-y", "@gannonh/firebase-mcp"],
    "env": {
      "SERVICE_ACCOUNT_KEY_PATH": "/path/to/serviceAccountKey.json",
      "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app",
      "DEBUG_LOG_FILE": "true"
    }
  }
}
```

Debug log writes to `~/.firebase-mcp/debug.log` by default, or specify a custom path.

### MCP Config — HTTP Transport (Multi-Client Mode)

Use this if you need to connect multiple MCP clients to one running server.

```bash
# Start server in HTTP mode
MCP_TRANSPORT=http MCP_HTTP_PORT=3000 npx @gannonh/firebase-mcp
```

```json
{
  "firebase-mcp": {
    "url": "http://localhost:3000/mcp"
  }
}
```

---

## Upload Methods Reference

The `@gannonh/firebase-mcp` `storage_upload` tool accepts four content formats.

### Method 1 — Local File Path (Recommended for all file types)

Best for: images, PDFs, binaries, large files. Most reliable for binary data.

```json
{
  "filePath": "uploads/report.pdf",
  "content": "/Users/you/Documents/report.pdf"
}
```

### Method 2 — Base64 Data URL (Small files, < 1MB)

Best for: images embedded in AI responses or clipboard data.

```json
{
  "filePath": "avatars/user-123.png",
  "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### Method 3 — Raw Text / String Content

Best for: Markdown files, JSON exports, plain text, config files.

```json
{
  "filePath": "exports/readme.md",
  "content": "# My README\n\nThis is a markdown file."
}
```

### Method 4 — Upload from External URL (`storage_upload_from_url`)

Best for: importing assets from external CDNs, API responses, or public URLs directly into your bucket.

```json
{
  "filePath": "assets/banner.jpg",
  "url": "https://example.com/path/to/banner.jpg"
}
```

> **Binary files (images, PDFs):** Always use Method 1 (local file path) for reliability. Base64 works but can fail with large files.

---

## Storage Tools Reference

### `@gannonh/firebase-mcp` Tools

| Tool | Description | Required Params | Optional Params |
|---|---|---|---|
| `storage_upload` | Upload file from content/path/base64 | `filePath`, `content` | `contentType` |
| `storage_upload_from_url` | Import file from external URL | `filePath`, `url` | `contentType` |
| `storage_list_files` | List files in a directory | none | `directoryPath` |
| `storage_get_file_info` | Get file metadata and download URL | `filePath` | — |

### Official Firebase MCP Tools (Storage)

| Tool | Description | Required Params |
|---|---|---|
| `storage_get_object_download_url` | Get download URL for a storage object | bucket, object path |
| `storage:generate_security_rules` | Generate Firestore/Storage security rules | — |

### Upload Response Format

A successful `storage_upload` returns:

```json
{
  "name": "uploads/quarterly-report.pdf",
  "size": "1024000",
  "contentType": "application/pdf",
  "updated": "2026-04-20T12:00:00.000Z",
  "downloadUrl": "https://storage.googleapis.com/your-bucket/uploads/quarterly-report.pdf?alt=media",
  "bucket": "your-project.appspot.com"
}
```

The `downloadUrl` is a **permanent public URL** — no expiry.

---

## Firebase Admin SDK — Direct Upload (Node.js)

Use this when you're writing your own MCP server tool or a Node.js backend that uploads to Firebase Storage programmatically.

### Install

```bash
npm install firebase-admin
```

### Initialize Admin SDK

```js
// firebase-admin.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('/path/to/serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.firebasestorage.app'
});

export const bucket = admin.storage().bucket();
```

### Upload a Local File (Recommended)

```js
import { bucket } from './firebase-admin.js';

async function uploadFile(localPath, storagePath, contentType) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: contentType,
    },
  });

  // Make the file publicly accessible and get the URL
  const file = bucket.file(storagePath);
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return publicUrl;
}

// Usage
const url = await uploadFile(
  '/tmp/report.pdf',
  'reports/2026/quarterly.pdf',
  'application/pdf'
);
console.log('Uploaded:', url);
```

### Upload from Buffer / Stream

```js
import { bucket } from './firebase-admin.js';
import { createReadStream } from 'fs';

async function uploadStream(localPath, storagePath, contentType) {
  const file = bucket.file(storagePath);

  await new Promise((resolve, reject) => {
    const readStream = createReadStream(localPath);
    const writeStream = file.createWriteStream({
      metadata: { contentType },
      resumable: false,        // set true for files > 5MB
    });

    readStream.pipe(writeStream)
      .on('finish', resolve)
      .on('error', reject);
  });

  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}
```

### Upload from Buffer (Base64 or raw bytes)

```js
import { bucket } from './firebase-admin.js';

async function uploadBuffer(buffer, storagePath, contentType) {
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    metadata: { contentType },
    public: true,
  });

  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

// Example: upload a base64 string
const base64Data = 'iVBORw0KGgoAAAANSUhEUgAA...';
const buffer = Buffer.from(base64Data, 'base64');
const url = await uploadBuffer(buffer, 'images/photo.png', 'image/png');
```

### Get a Signed URL (Temporary, Private Files)

```js
async function getSignedUrl(storagePath, expiresInMinutes = 60) {
  const file = bucket.file(storagePath);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });
  return url;
}
```

---

## Client-Side Upload (React / Web SDK)

Use this in your `code-helper-studio` React frontend to upload files directly from the browser.

### Install

```bash
npm install firebase
```

### Initialize Storage

```js
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

### Simple Upload (Small Files)

```js
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.js';

async function uploadFile(file, storagePath) {
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
```

### Upload a String or Base64

```js
import { ref, uploadString } from 'firebase/storage';
import { storage } from './firebase.js';

// Raw string
await uploadString(ref(storage, 'notes/readme.txt'), 'Hello world');

// Base64
await uploadString(
  ref(storage, 'images/photo.png'),
  'iVBORw0KGgoAAAANSUhEUgAA...',
  'base64'
);

// Data URL
await uploadString(
  ref(storage, 'images/photo.png'),
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  'data_url'
);
```

---

## Resumable Upload with Progress Tracking

Use `uploadBytesResumable` for files over 1MB or when you need a progress bar.

```js
import {
  getStorage, ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { storage } from './firebase.js';

function uploadWithProgress(file, storagePath, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload paused');
            break;
          case 'running':
            console.log(`Upload ${Math.round(progress)}% complete`);
            break;
        }
      },
      (error) => {
        // See Error Handling Reference below for full error codes
        console.error('Upload error:', error.code);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadURL, path: storagePath });
      }
    );

    // Return controls so caller can pause/resume/cancel
    return {
      pause: () => uploadTask.pause(),
      resume: () => uploadTask.resume(),
      cancel: () => uploadTask.cancel(),
    };
  });
}

// Usage in React component
const result = await uploadWithProgress(
  file,
  `user-uploads/${userId}/${file.name}`,
  (pct) => setProgress(pct)
);
console.log('Download URL:', result.downloadURL);
```

---

## Security Rules

### Open (Development Only — never use in production)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Authenticated Users Only

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /user-uploads/{userId}/{allPaths=**} {
      // Only the authenticated user can read/write their own files
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /public/{allPaths=**} {
      // Anyone can read public files, only auth users can write
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### File Type and Size Validation

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{fileName} {
      allow write: if request.auth != null
        && request.auth.uid == userId
        // Max 10MB
        && request.resource.size < 10 * 1024 * 1024
        // Images and PDFs only
        && (request.resource.contentType.matches('image/.*')
            || request.resource.contentType == 'application/pdf');

      allow read: if request.auth != null;
    }
  }
}
```

> Use the official Firebase MCP `storage:generate_security_rules` tool to auto-generate rules for your project.

---

## Storage Folder Structure — Best Practices

```
your-bucket/
├── public/                    # Publicly readable, no auth needed
│   ├── images/
│   └── assets/
├── user-uploads/
│   └── {userId}/              # User-private files
│       ├── avatars/
│       ├── documents/
│       └── temp/              # Staging area, cleaned up by Cloud Function
├── exports/                   # AI-generated or server-generated files
│   └── {date}/
├── reports/                   # Admin-level, locked down
│   └── {year}/
└── thumbnails/                # Server-generated, derived from user-uploads
    └── {userId}/
```

**Naming conventions:**
- Use lowercase with hyphens: `user-report-2026.pdf`
- Include user ID in path to scope security rules: `user-uploads/{uid}/file.pdf`
- Include timestamps for uniqueness: `uploads/${Date.now()}-${fileName}`
- Avoid spaces — use `%20` encoding issues make it painful

---

## Error Handling Reference

| Error Code | Cause | Fix |
|---|---|---|
| `storage/unauthorized` | User lacks permission to access the object | Check security rules and user auth state |
| `storage/canceled` | Upload was canceled by calling `.cancel()` | Expected — handle gracefully in UI |
| `storage/unknown` | Unknown server error | Check `error.serverResponse` for details |
| `storage/quota-exceeded` | Storage quota exceeded | Upgrade billing plan or delete old files |
| `storage/unauthenticated` | User is not logged in | Ensure Firebase Auth is initialized and user is signed in |
| `storage/retry-limit-exceeded` | Too many retries (usually network issue) | Retry after delay; check internet connection |
| `storage/invalid-checksum` | File corrupted during transfer | Re-upload the file |
| `storage/object-not-found` | File doesn't exist at the given path | Verify the path with `storage_list_files` |
| `storage/bucket-not-found` | Bucket name is wrong | Verify bucket in Firebase Console → Storage |
| `storage/project-not-found` | Project config is wrong | Check `firebaseConfig.storageBucket` value |

```js
// Comprehensive error handler
function handleStorageError(error) {
  const messages = {
    'storage/unauthorized': 'You do not have permission to upload here.',
    'storage/canceled': 'Upload was canceled.',
    'storage/quota-exceeded': 'Storage quota exceeded. Contact support.',
    'storage/unauthenticated': 'You must be signed in to upload files.',
    'storage/retry-limit-exceeded': 'Upload failed after multiple retries. Check your connection.',
    'storage/invalid-checksum': 'File may be corrupted. Please try again.',
  };

  return messages[error.code] || `Upload failed: ${error.message}`;
}
```

---

## Environment Variables Reference

### `@gannonh/firebase-mcp` Server

| Variable | Required | Default | Description |
|---|---|---|---|
| `SERVICE_ACCOUNT_KEY_PATH` | Yes | — | Absolute path to service account key JSON |
| `FIREBASE_STORAGE_BUCKET` | No | `[projectId].appspot.com` | Storage bucket name |
| `MCP_TRANSPORT` | No | `stdio` | Transport mode: `stdio` or `http` |
| `MCP_HTTP_PORT` | No | `3000` | Port for HTTP transport |
| `MCP_HTTP_HOST` | No | `localhost` | Host for HTTP transport |
| `MCP_HTTP_PATH` | No | `/mcp` | Path for HTTP transport |
| `DEBUG_LOG_FILE` | No | — | `true` or custom path to enable debug logging |

### React / Client-Side (.env)

```bash
# .env.local (Vite)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Troubleshooting

### "The specified bucket does not exist"

1. Open Firebase Console → Storage → copy the exact bucket name shown
2. It usually looks like `your-project-id.firebasestorage.app` (not `.appspot.com` for newer projects)
3. Set `FIREBASE_STORAGE_BUCKET` in your MCP env config to that exact value

### Service Account Key Not Found

- Use an **absolute path** — relative paths will fail
- Example: `/Users/you/keys/firebase-key.json` not `./keys/firebase-key.json`
- Verify the file exists: `ls /path/to/serviceAccountKey.json`

### MCP Server Not Appearing in Client

- Check your config file is valid JSON (no trailing commas)
- Restart the MCP client completely after editing config
- Run `DEBUG_LOG_FILE=true npx @gannonh/firebase-mcp` in terminal to see startup errors

### Binary Files Uploading as Corrupted

- Always use the **local file path method** for images, PDFs, and any binary file
- Base64 encoding is only reliable for files under ~1MB
- If using `storage_upload_from_url`, ensure the source URL returns the correct `Content-Type` header

### Upload Succeeds but File Is Private (No Public URL)

- Admin SDK: Call `file.makePublic()` after upload, or set `public: true` in `file.save()` options
- Client SDK: Security rules control readability — add a `allow read: if true` rule for public paths
- `@gannonh/firebase-mcp` automatically generates permanent public download URLs on upload

---

## Decision Guide

| Situation | Best Approach |
|---|---|
| AI agent needs to upload a file it generated | `@gannonh/firebase-mcp` → `storage_upload` with local file path |
| AI agent needs to import an image from a URL | `@gannonh/firebase-mcp` → `storage_upload_from_url` |
| React app user uploads a file via browser | Client SDK `uploadBytesResumable` with progress tracking |
| Node.js server/Cloud Function uploads a file | Firebase Admin SDK `bucket.upload()` |
| Need the download URL of an existing file | Official Firebase MCP → `storage_get_object_download_url` |
| Large file (>5MB) upload from server | Admin SDK with `resumable: true` stream |
| Need to generate Storage security rules | Official Firebase MCP → `storage:generate_security_rules` |
| Temporary/private file access | Signed URL via Admin SDK `file.getSignedUrl()` |
| Upload text/JSON/Markdown via MCP | `@gannonh/firebase-mcp` `storage_upload` with string content |

---

*Sources: [gannonh/firebase-mcp](https://github.com/gannonh/firebase-mcp) · [Firebase MCP Server (Official)](https://firebase.google.com/docs/ai-assistance/mcp-server) · [Firebase Storage Upload Docs](https://firebase.google.com/docs/storage/web/upload-files) · Last updated: April 2026*
