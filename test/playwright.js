const { chromium } = require("playwright");
const path = require('path');
const expect = require("expect");
const axeCore = require("axe-core");
const { parse: parseURL } = require("url");
const assert = require("assert");

// Cheap URL validation
const isValidURL = (input) => {
  const u = parseURL(input);
  return u.protocol && u.host;
};

// node axe-puppeteer.js <url>
const URL_HOME = "localhost:3000";
const URL_ABOUT = "localhost:3000/about"


const main = async (url, name) => {
  let results;
  assert(isValidURL(url), "Invalid URL");
  const headless = (process.env.HEADLESS || "1") === "1";
  const browser = await chromium.launch({ headless });
  const browserContext = await browser.newContext();
  const page = await browserContext.newPage();
  
  try {
    await page.goto(url);
    await screenshot(page, name)
    // Inject and run axe-core
    const handle = await page.evaluateHandle(`
			// Inject axe source code
			${axeCore.source}
			// Run axe
			axe.run()
    `);
    
    // Get the results from `axe.run()`.
    results = await handle.jsonValue();
    // Destroy the handle & return axe results.
    await handle.dispose();
  } catch (err) {
    // Ensure we close the puppeteer connection when possible
    if (browserContext) {
      await page.close();
      await browserContext.close();
      await browser.close();
    }

    // Re-throw
    throw err;
  }

  await page.close();
  await browserContext.close();
  await browser.close();
  return results;
};

main(URL_HOME, "home")
  .then((results) => {
    // console.log(results.violations);
    expect(results.violations.length).toBe(0);
  })
  .catch((err) => {
    console.error("Error running axe-core:", err.message);
  });

main(URL_ABOUT, "about")
  .then((results) => {
    // console.log(results.violations);
    expect(results.violations.length).toBe(0);
  })
  .catch((err) => {
    console.error("Error running axe-core:", err.message);
  });

async function screenshot(page, name) {
  await page.screenshot({
    path: `test/${name}.png`,
  });
}
