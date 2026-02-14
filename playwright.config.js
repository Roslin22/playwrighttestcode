// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = defineConfig({
  testDir: './tests',
  timeout: 40 * 1000,
  expect:{
    timeout:2000
  },
  reporter:'html',
  use: {
    browserName:'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',
    //trace: 'retain-on-failure',
    
  },

 
});
export default config;

