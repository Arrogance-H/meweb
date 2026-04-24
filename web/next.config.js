/** @type {import('next').NextConfig} */

// Parse the Emby server hostname from EMBY_URL at build time so that
// Next.js Image Optimization only allows images from the configured Emby host.
// Falls back to allowing all hosts when EMBY_URL is not set (e.g. CI builds).
function buildRemotePatterns() {
  const raw = process.env.EMBY_URL;
  if (raw) {
    try {
      const parsed = new URL(raw);
      return [{ protocol: parsed.protocol.replace(':', ''), hostname: parsed.hostname }];
    } catch {
      // ignore malformed URL, fall through to wildcard
    }
  }
  // Wildcard fallback — acceptable for a self-hosted tool where the Emby
  // server address is user-configurable and not known at image build time.
  return [
    { protocol: 'http', hostname: '**' },
    { protocol: 'https', hostname: '**' },
  ];
}

const nextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

module.exports = nextConfig;
