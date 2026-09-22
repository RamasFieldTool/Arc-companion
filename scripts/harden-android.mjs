import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const networkDir = path.join(root, 'android', 'app', 'src', 'main', 'res', 'xml');
const networkPath = path.join(networkDir, 'network_security_config.xml');
const capacitorConfigPath = path.join(root, 'capacitor.config.json');

const config = JSON.parse(await readFile(capacitorConfigPath, 'utf8'));

if (config?.server?.url) {
  throw new Error('Security stop: server.url is not allowed. The Android app must ship a local reviewed snapshot.');
}

if (Array.isArray(config?.server?.allowNavigation) && config.server.allowNavigation.length) {
  throw new Error('Security stop: unrestricted in-app navigation is not allowed.');
}

let manifest = await readFile(manifestPath, 'utf8');

if (/android:debuggable\s*=\s*["']true["']/i.test(manifest)) {
  throw new Error('Security stop: main Android manifest enables debuggable=true.');
}

const permissionMatches = [...manifest.matchAll(/<uses-permission\s+android:name=["']([^"']+)["'][^>]*>/g)];
const allowedPermissions = new Set(['android.permission.INTERNET']);
const unexpected = permissionMatches
  .map(match => match[1])
  .filter(permission => !allowedPermissions.has(permission));

if (unexpected.length) {
  throw new Error(`Security stop: unexpected Android permissions: ${[...new Set(unexpected)].join(', ')}`);
}

manifest = manifest.replace(
  /<application\b([^>]*)>/,
  (full, attrs) => {
    let next = attrs;

    if (/android:usesCleartextTraffic\s*=/.test(next)) {
      next = next.replace(/android:usesCleartextTraffic\s*=\s*["'][^"']*["']/g, 'android:usesCleartextTraffic="false"');
    } else {
      next += '\n        android:usesCleartextTraffic="false"';
    }

    if (/android:networkSecurityConfig\s*=/.test(next)) {
      next = next.replace(/android:networkSecurityConfig\s*=\s*["'][^"']*["']/g, 'android:networkSecurityConfig="@xml/network_security_config"');
    } else {
      next += '\n        android:networkSecurityConfig="@xml/network_security_config"';
    }

    return `<application${next}>`;
  }
);

await writeFile(manifestPath, manifest, 'utf8');
await mkdir(networkDir, { recursive: true });
await writeFile(
  networkPath,
  `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
`,
  'utf8'
);

console.log('Android security hardening applied: HTTPS-only network policy, no remote app shell, permission allowlist checked.');
