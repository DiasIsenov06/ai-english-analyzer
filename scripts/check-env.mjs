import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (process.env.JWT_SECRET && (process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production')) missing.push('JWT_SECRET (at least 32 characters; replace placeholder)');
if (missing.length) { console.error(`Missing or invalid configuration: ${missing.join(', ')}`); process.exit(1); }
console.log('Required environment configuration is present. Values are not printed.');
