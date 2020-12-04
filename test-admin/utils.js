/* eslint-env node */

const ora = require('ora');

async function waitForAllImagesToLoad(app, selector) {
  await app.evaluate(async (innerSelector) => {
    await Promise.all(
      Array.from(document.querySelectorAll(innerSelector)).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', reject);
        });
      }),
    );
  }, selector);
}

async function waitForGraphQLResponse(page) {
  await page.waitForResponse('https://email.myshopify.io/graphql?locale=en');
}

async function logInContext(browserContext) {
  const page = await browserContext.newPage();
  await page.goto('https://shop1.myshopify.io/admin');
  await page.click('a.ui-action-list-action');
  await page.click('[value="Continue"]');
  await page.waitForSelector('"Marketing"');
  await page.close();
}

async function test(name, testFn) {
  const spinner = ora(name).start();

  try {
    await Promise.resolve(testFn());
    spinner.succeed();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    spinner.fail();
    process.exit(1);
  }
}

module.exports = {
  waitForAllImagesToLoad,
  waitForGraphQLResponse,
  logInContext,
  test,
};
