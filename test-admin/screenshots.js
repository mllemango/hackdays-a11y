/* eslint-env node */
const fs = require('fs');
const path = require('path');

const ora = require('ora');
const glob = require('glob');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const {chromium} = require('playwright');

const gitBranch = fs
  .readFileSync(path.join(__dirname, '../.git/HEAD'), 'utf-8')
  .trim()
  .split('/')[2];

const currentBranch =
  process.env.UPDATE_MAIN_SCREENSHOTS === '1' || gitBranch === 'master'
    ? 'main'
    : 'current';

const screenshotsBase = path.join(__dirname, '../tmp/playwright');
const screenshotsBranch = path.join(screenshotsBase, currentBranch);

function setupScreenshots() {
  if (fs.existsSync(screenshotsBranch)) {
    fs.rmdirSync(screenshotsBranch, {recursive: true});
  }

  fs.mkdirSync(screenshotsBranch, {recursive: true});
}

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(screenshotsBranch, `${name}.png`),
  });
}

async function compareScreenshots() {
  if (currentBranch !== 'current') {
    return;
  }
  const mainScreenshots = path.join(screenshotsBase, 'main');
  if (!fs.existsSync(mainScreenshots)) {
    ora(
      'Unable to compare screenshots. Run with the command from the main branch or with UPDATE_MAIN_SCREENSHOTS=1 dev smoketest',
    ).fail();
    process.exit(1);
  }
  const files = glob.sync(`${screenshotsBranch}/*.png`);
  let shouldCheckScreenshots = false;
  const pages = [];
  const browser = await chromium.launch({headless: false});
  const browserContext = await browser.newContext();
  browserContext.setDefaultTimeout(60000);

  for (const file of files) {
    const fileName = path.basename(file);

    const mainImage = PNG.sync.read(
      fs.readFileSync(path.join(mainScreenshots, fileName)),
    );
    const branchImage = PNG.sync.read(
      fs.readFileSync(path.join(screenshotsBranch, fileName)),
    );
    const {width, height} = mainImage;
    const diff = new PNG({width, height});
    const pixelDiff = pixelmatch(
      mainImage.data,
      branchImage.data,
      diff.data,
      width,
      height,
      {threshold: 0.3},
    );

    if (pixelDiff) {
      shouldCheckScreenshots = true;
      const base64 = PNG.sync.write(diff).toString('base64');

      const page = await browserContext.newPage();
      await page.goto(`data:image/png;base64,${base64}`);
      pages.push(page);
    }
  }

  if (!shouldCheckScreenshots || process.env.CI) {
    await browserContext.close();
    await browser.close();
  } else {
    await Promise.all(
      pages.map(
        (page) =>
          new Promise((resolve) => {
            page.on('close', resolve);
            page.on('crash', resolve);
          }),
      ),
    );
    await browserContext.close();
    await browser.close();
  }
}

module.exports = {
  setupScreenshots,
  screenshot,
  compareScreenshots,
};
