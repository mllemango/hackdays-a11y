/* eslint-disable jest/require-top-level-describe */
/* eslint-env node */

const expect = require('expect');
const ora = require('ora');
const {chromium} = require('playwright');
const axeCore = require("axe-core");
const {test, logInContext, waitForGraphQLResponse} = require('./utils');

const headless = (process.env.HEADLESS || '1') === '1';

(async () => {
  const setupSpinner = ora('Setting up browser session').start();
  const browser = await chromium.launch({headless});
  const browserContext = await browser.newContext();
  browserContext.setDefaultTimeout(60000);

  // Here we are disabling the screenshot service
  browserContext.route(
    (url) => url.host === 'screenshot-service.myshopify.io',
    (route) => route.abort(),
  );

  await logInContext(browserContext);
  const page = await browserContext.newPage();
  setupSpinner.succeed();

  // await test('No accessibility issues on landing page', async () => {
  //   await page.goto('https://shop1.myshopify.io/admin/');
  //   await screenshot(page, 'landing-page');
  //   // Inject and run axe-core
  //   const handle = await page.evaluateHandle(`
  //     // Inject axe source code
  //     ${axeCore.source}
  //     // Run axe
  //     axe.run()
  //   `);
  //   results = await handle.jsonValue();
  //   expect(results.violations.length).toBe(0);
  //   // Destroy the handle & return axe results.
  //   await handle.dispose();
  // });

  await test('No accessibility violations on products page', async()=> {
    await page.goto('https://shop1.myshopify.io/admin/products');

    await screenshot(page, 'products-page');
    // Inject and run axe-core
    const handle = await page.evaluateHandle(`
      // Inject axe source code
      ${axeCore.source}
      // Run axe
      axe.run()
    `);
    results = await handle.jsonValue();
    expect(results.violations.length).toBe(0);
    // Destroy the handle & return axe results.
    await handle.dispose();
  });


  await page.close();
  await browserContext.close();
  await browser.close();
  await compareScreenshots();
  process.exit(0);

})();

async function screenshot(page, name) {
  await page.screenshot({
    path: `test-admin/${name}.png`,
  });
}
