import { resolve } from 'node:path';
import { getCallerFile } from '../functions/getCallerFile.ts';

interface StoryMetaData {
  id: string;
  title: string;
  name: string;
  importPath: string;
  type: string;
  tags: string[];
}

export interface StorybookStoryMetaData extends StoryMetaData {
  url: string;
  selector: '#storybook-root';
  storyPath: string;
}

export async function fetchStories(baseUrl: string): Promise<StorybookStoryMetaData[]> {
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  const url = `${baseUrl}index.json`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch (e) {
    console.error(`Failed to fetch ${url}`);
    throw e;
  }
  if (!response.ok) {
    console.error({ response });
    throw new Error(`Failed to fetch ${url} : ${response.statusText}`);
  }
  const data = (await response.json()) as { entries: Record<string, StoryMetaData> };
  return Object.values(data.entries)
    .filter((story: StoryMetaData) => story.type !== 'docs')
    .map((story: StoryMetaData): StorybookStoryMetaData => {
      // a11y.manual:!true => disable the automatic a11y addon check, as we want to do it in playwright and it can only run once concurrently
      const url = `${baseUrl}iframe.html?id=${story.id}&globals=a11y.manual:!true`;
      return { ...story, url, selector: '#storybook-root', storyPath: resolve(story.importPath) };
    });
}

export async function buildTestUrlAsync(baseUrl: string, storyName: string): Promise<string> {
  const stories = await fetchStories(baseUrl);
  const callerFile = getCallerFile(3);
  const fileName = callerFile.replace(/\.spec\.(js|jsx|mjs|ts|tsx)$/, ''); // Remove '.spec.js' or '.spec.ts' suffix

  for (const story of stories) {
    const path = story.storyPath
      .replace(/^\.\//, '') // Remove leading './' if present
      .replace(/\.stories\.(js|jsx|mjs|ts|tsx)$/, ''); // Remove '.stories.js' or '.stories.ts' suffix

    if (!fileName.endsWith(path)) {
      continue;
    }
    if (story.name.toLowerCase() !== storyName.toLowerCase()) {
      continue;
    }

    return story.url;
  }

  throw new Error(`Story with name "${storyName}" not found in entries.`);
}
