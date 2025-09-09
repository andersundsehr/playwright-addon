# @andersundsehr/playwright-addon
A Playwright package for Storybook that provides a set of tools and utilities to enhance the integration between Playwright and Storybook.


## Install

```bash
npm install --save-dev @andersundsehr/playwright-addon
# or
yarn add -D @andersundsehr/playwright-addon
```

## Features

### test all stories in a Storybook instance (fetchStories and snapshotTest)

````ts
import { fetchStories, test, snapshotTest } from '@andersundsehr/playwright-addon';

const stories = await fetchStories('https://' + process.env.VIRTUAL_HOST);

for (const story of stories) {

  test(`${story.title} ${story.name}`, async function ({ page }) {
    await snapshotTest(page, {story});
  });
}

````

### page.gotToStory()

If you put your test file beside your story file, you can use `page.goToStory('storyId')` to go to a specific story.  
requirements:
- your test filename must match this regex: `/\.spec\.(js|jsx|mjs|ts|tsx)$/`
- your story filename must match this regex: `/\.stories\.(js|jsx|mjs|ts|tsx)$/`
- the part before `.spec.` and `.stories.` must be the same
- eg: `Button.stories.ts` and `Button.spec.ts`

````ts
import { test } from '@andersundsehr/playwright-addon';

test('my test', async function ({ page }) {
  await page.goToStory('Default'); // storyId from the export const Default = ...
  
  // test your component here:
});
````

### page.assertConsoleLogEmpty()

This can be used to assert that there are no console logs, warnings or errors on the page.
If you want to ignore all current issues, you can use `playwright test --update-snapshots` to update the snapshots and ignore the current issues.  
This will create an `<snapshotFolder>/<testcase>.consoleignore` file with the current issues ignored.

````ts
import { test } from '@andersundsehr/playwright-addon';
test('my console logging test', async function ({ page }) {

  // ... page.goto or page.goToStory ...
  
  await page.assertConsoleLogEmpty();
});
````

### checkAccessibility()

This uses axe-core to check accessibility issues on the page.

- You can provide a selector to limit the check to a specific part of the page (e.g. your component root element).
- You can also provide a list of accessibility tags to check against (default is a good set of tags). [List of possible tags](https://www.deque.com/axe/core-documentation/api-documentation/) 
- You can also choose to have the axe reports saved in a folder (axe-reports) instead of just the console.

If there is an accessibility issue, the test will fail and you will get a report in the console (and in a file if axeFolder is true).  
If you want to ignore all current issues, you can use `playwright test --update-snapshots` to update the snapshots and ignore the current issues.  
This will create an `<snapshotFolder>/<testcase>.accessibilityignore` file with the current issues ignored.

````ts
import { test, checkAccessibility } from '@andersundsehr/playwright-addon';
test('my accessibility test', async function ({ page }) {
  await checkAccessibility(
    page,
    '#root', // selector: default is 'body'
    ['wcag22aa', 'wcag22a', 'wcag21aa', 'wcag21a', 'wcag2aa', 'wcag2a', 'best-practice'], // accessibilityTags: default as shown here
    false, // axeFolder: default is false, if you want the reports in a folder, set it to true
  );
});
````

## TODOs:

- include histoire support

# with ♥️ from anders und sehr GmbH

> If something did not work 😮  
> or you appreciate this Extension 🥰 let us know.

> We are always looking for great people to join our team!
> https://www.andersundsehr.com/karriere/
