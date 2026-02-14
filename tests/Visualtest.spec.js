const {expect, test} = require('@playwright/test');
import fs from 'fs';


test.only('Visual1 test for translator page', async ({ page }) => {
   await page.goto('https://www.google.com/');
expect (await page.screenshot()).toMatchSnapshot('flighaware-homepage.png');
});