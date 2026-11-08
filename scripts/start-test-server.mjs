import { spawnSync, spawn } from 'node:child_process';
// Intentionally overrides any .env: this database is a disposable local container.
const env = {...process.env, DATABASE_URL:'postgresql://lab_test:lab_test_local_only@127.0.0.1:55432/aea_lab_test',
 JWT_SECRET:'isolated-test-signing-key-never-for-production-2026', AI_ENABLED:'false', NEXT_DIST_DIR:'.next-test', NEXT_TELEMETRY_DISABLED:'1'};
const prepared=spawnSync(process.execPath,['node_modules/prisma/build/index.js','db','push','--skip-generate'],{env,stdio:'inherit'});
if(prepared.status!==0)process.exit(prepared.status||1);
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3100'],{env,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.kill(signal));
server.on('exit',code=>process.exit(code||0));
