import { expect, test, type Page } from '@andersundsehr/playwright-addon';
import { checkAccessibility } from './checkAccessibility.ts';

interface PartialSettings {
  selector: string;
  date: Date | string;
  accessibilityTags: string[];
  viewportSize: {
    width: number;
    height: number;
  };
}

export interface StoryInfo extends Partial<PartialSettings> {
  url: string;
  name: string;
  /**
   * resolved absolute path to story file
   */
  storyPath: string;
}

export interface SnapshotTestSettings extends Partial<PartialSettings> {
  story: StoryInfo;
  axeFolder?: boolean;
}

interface Settings extends PartialSettings {
  story: StoryInfo;
  date: Date;
  axeFolder: boolean;
}

function getSettings(inputSettings: SnapshotTestSettings): Settings {
  const settings = {
    date: '2038-01-19T03:14:07',
    accessibilityTags: ['wcag22aa', 'wcag22a', 'wcag21aa', 'wcag21a', 'wcag2aa', 'wcag2a', 'best-practice'],
    viewportSize: { width: 1280, height: 800 },
    axeFolder: true,
    ...inputSettings,
    ...inputSettings.story,
  };
  if (!('selector' in settings)) {
    throw new Error('No selector provided');
  }
  if (typeof settings.selector !== 'string' || settings.selector.trim() === '') {
    throw new Error('No selector provided');
  }
  const date = new Date(settings.date);

  return {
    story: settings.story,
    selector: settings.selector,
    accessibilityTags: settings.accessibilityTags,
    viewportSize: settings.viewportSize,
    axeFolder: settings.axeFolder,
    date,
  } satisfies Settings;
}

function setSnapshotPathTemplate(snapshotPathTemplate: string) {
  (test.info() as unknown as { _projectInternal: { snapshotPathTemplate: string } })._projectInternal.snapshotPathTemplate = snapshotPathTemplate;
}

export async function snapshotTest(page: Page, inputSettings: SnapshotTestSettings) {
  const settings = getSettings(inputSettings);

  await page.setViewportSize(settings.viewportSize);

  await page.clock.setFixedTime(settings.date);
  await page.clock.pauseAt(settings.date);

  await page.goto(settings.story.url);

  setSnapshotPathTemplate(`${settings.story.storyPath}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}`);

  await expect(page.locator(settings.selector)).toMatchAriaSnapshot();
  await expect(page.locator(settings.selector)).toHaveScreenshot();

  await page.assertConsoleLogEmpty();

  await page.clock.resume();

  await checkAccessibility(page, settings.selector, settings.accessibilityTags, settings.axeFolder);
}
