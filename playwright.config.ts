import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'tests/e2e',workers:1,timeout:90000,
 use:{baseURL:'http://127.0.0.1:3100',headless:true,screenshot:'only-on-failure'},
 reporter:[['list'],['json',{outputFile:'test-results/e2e.json'}]],
 webServer:{command:'node scripts/start-test-server.mjs',url:'http://127.0.0.1:3100',reuseExistingServer:false,timeout:180000}});
