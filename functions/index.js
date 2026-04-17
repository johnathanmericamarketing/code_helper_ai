const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

const ftp = require("basic-ftp");
const Client = require("ssh2-sftp-client");

initializeApp();
const db = getFirestore();

/** Helper to fetch server credentials. */
async function getServerCredentials(serverId) {
  const doc = await db.collection("servers").doc(serverId).get();
  if (!doc.exists) {
    throw new HttpsError("not-found", "Server connection not found");
  }
  return doc.data();
}

/** SFTP/SSH Config builder */
function buildSftpConfig(server) {
  const config = {
    host: server.host,
    port: server.port || 22,
    username: server.username,
  };
  if (server.ssh_key) {
    config.privateKey = server.ssh_key;
  } else {
    config.password = server.password;
  }
  return config;
}

/** 1. Test Connection */
exports.testConnection = onCall(async (request) => {
  const { serverId } = request.data;
  if (!serverId) throw new HttpsError("invalid-argument", "Missing serverId");

  const server = await getServerCredentials(serverId);
  
  if (server.server_type === "ftp") {
    const client = new ftp.Client();
    try {
      await client.access({
        host: server.host,
        port: server.port || 21,
        user: server.username,
        password: server.password,
        secure: false,
      });
      db.collection("servers").doc(serverId).update({ last_connected: new Date().toISOString() }).catch(() => {});
      return { success: true, message: "FTP connection successful!" };
    } catch (e) {
      throw new HttpsError("internal", "FTP connection failed: " + e.message);
    } finally {
      client.close();
    }
  } else {
    const sftp = new Client();
    try {
      await sftp.connect(buildSftpConfig(server));
      db.collection("servers").doc(serverId).update({ last_connected: new Date().toISOString() }).catch(() => {});
      return { success: true, message: "SFTP connection successful!" };
    } catch (e) {
      throw new HttpsError("internal", "SFTP connection failed: " + e.message);
    } finally {
      sftp.end();
    }
  }
});

/** 2. List Remote Files */
exports.listRemoteFiles = onCall(async (request) => {
  const { serverId, path = '' } = request.data;
  if (!serverId) throw new HttpsError("invalid-argument", "Missing serverId");

  const server = await getServerCredentials(serverId);
  const targetPath = path || server.remote_path || '/';

  if (server.server_type === "ftp") {
    const client = new ftp.Client();
    try {
      await client.access({
        host: server.host,
        port: server.port || 21,
        user: server.username,
        password: server.password,
        secure: false,
      });
      const list = await client.list(targetPath);
      return list.map(item => ({
        name: item.name,
        type: item.isDirectory ? 'dir' : 'file',
        size: item.size
      }));
    } catch (e) {
      throw new HttpsError("internal", "FTP Error: " + e.message);
    } finally {
      client.close();
    }
  } else {
    const sftp = new Client();
    try {
      await sftp.connect(buildSftpConfig(server));
      const list = await sftp.list(targetPath);
      return list.map(item => ({
        name: item.name,
        type: item.type === 'd' ? 'dir' : 'file',
        size: item.size
      }));
    } catch (e) {
      throw new HttpsError("internal", "SFTP Error: " + e.message);
    } finally {
      sftp.end();
    }
  }
});

/** 3. Read Remote File */
exports.readRemoteFile = onCall(async (request) => {
  const { serverId, filePath } = request.data;
  if (!serverId || !filePath) throw new HttpsError("invalid-argument", "Missing args");

  const server = await getServerCredentials(serverId);

  if (server.server_type === "ftp") {
    const client = new ftp.Client();
    try {
      await client.access({
        host: server.host,
        port: server.port || 21,
        user: server.username,
        password: server.password,
        secure: false,
      });
      const stream = new require('stream').PassThrough();
      let fileContent = '';
      stream.on('data', chunk => { fileContent += chunk.toString(); });
      
      await client.downloadTo(stream, filePath);
      return { content: fileContent };
    } catch (e) {
      throw new HttpsError("internal", "FTP Error: " + e.message);
    } finally {
      client.close();
    }
  } else {
    const sftp = new Client();
    try {
      await sftp.connect(buildSftpConfig(server));
      const buffer = await sftp.get(filePath);
      return { content: buffer.toString('utf8') };
    } catch (e) {
      throw new HttpsError("internal", "SFTP Error: " + e.message);
    } finally {
      sftp.end();
    }
  }
});

/** 4. Deploy Code (Write File) */
exports.deployCode = onCall(async (request) => {
  const { serverId, fileData } = request.data; // fileData: { path: string, content: string }[]
  if (!serverId || !fileData || !Array.isArray(fileData)) throw new HttpsError("invalid-argument", "Invalid payload");

  const server = await getServerCredentials(serverId);

  if (server.server_type === "ftp") {
    const client = new ftp.Client();
    try {
      await client.access({
        host: server.host,
        port: server.port || 21,
        user: server.username,
        password: server.password,
        secure: false,
      });

      for (const file of fileData) {
        const { Readable } = require('stream');
        const stream = Readable.from([file.content]);
        const fullPath = (server.remote_path.replace(/\/$/, '') + '/' + file.path.replace(/^\//, ''));
        
        // Ensure dir exists
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
        await client.ensureDir(dir);
        
        await client.uploadFrom(stream, fullPath);
      }
      return { success: true, message: `Deployed ${fileData.length} files via FTP.` };
    } catch (e) {
      throw new HttpsError("internal", "FTP Error: " + e.message);
    } finally {
      client.close();
    }
  } else {
    const sftp = new Client();
    try {
      await sftp.connect(buildSftpConfig(server));
      
      for (const file of fileData) {
        const fullPath = (server.remote_path.replace(/\/$/, '') + '/' + file.path.replace(/^\//, ''));
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
        
        const dirExists = await sftp.exists(dir);
        if (!dirExists) {
          await sftp.mkdir(dir, true);
        }
        
        await sftp.put(Buffer.from(file.content, 'utf8'), fullPath);
      }
      return { success: true, message: `Deployed ${fileData.length} files via SFTP/SSH.` };
    } catch (e) {
      throw new HttpsError("internal", "SFTP Error: " + e.message);
    } finally {
      sftp.end();
    }
  }
});
