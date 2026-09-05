const requiredEnvironment = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 3000),
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173,http://localhost:5174,http://localhost:8443')
    .split(',')
    .map((origin) => origin.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, ''))
    .filter(Boolean),
  isProduction: process.env.NODE_ENV === 'production',
  bmkgCacheTtlMinutes: Number(process.env.BMKG_CACHE_TTL_MINUTES ?? 120),
};
