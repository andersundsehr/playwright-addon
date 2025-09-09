import type { Browser, BrowserContext, Frame, Locator, Page as OriginalPage, TestInfo } from '@playwright/test';
import * as playwright from '@playwright/test';
import { buildTestUrlAsync } from './systems/storybook.ts';
import { consoleLogging } from './functions/consoleLogging.ts';

export type { Locator, Browser, BrowserContext, Frame, TestInfo };

export const chromium = playwright.chromium;
export const firefox = playwright.firefox;
export const webkit = playwright.webkit;
export const selectors = playwright.selectors;

export const devices = playwright.devices;
export const errors = playwright.errors;
export const request = playwright.request;
export const _electron = playwright._electron;
export const _android = playwright._android;
export const expect = playwright.expect;
export const defineConfig = playwright.defineConfig;
export const mergeTests = playwright.mergeTests;
export const mergeExpects = playwright.mergeExpects;

export interface Page extends OriginalPage {
  gotoStory: (storyName: string) => ReturnType<OriginalPage['goto']>;
  assertConsoleLogEmpty: () => Promise<void>;
}

export const test = playwright.test.extend<{ page: Page }>({
  page: async ({ baseURL, page }, use) => {
    if (!baseURL) {
      throw new Error('baseURL is required');
    }
    const logging = consoleLogging(page);
    await use(
      Object.assign(page, {
        gotoStory: async (storyName: string) => page.goto(await buildTestUrlAsync(baseURL, storyName)),
        async assertConsoleLogEmpty() {
          await logging.assertEmpty();
        },
      }),
    );
  },
});

export default test;
