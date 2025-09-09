import * as storybook from '../systems/storybook.ts';
import * as histoire from '../systems/histoire.ts';

const system: 'storybook' | 'histoire' = 'storybook'; // TODO handle

interface StoryMetaData {
  name: string;
  title: string;
  storyPath: string;
  url: string;
  selector?: string;
  date?: string | Date;
  accessibilityTags?: string[];
  viewportSize?: { width: number; height: number };
}

export async function buildTestUrlAsync(baseUrl: string, storyName: string): Promise<string> {
  if (system === 'storybook') {
    return storybook.buildTestUrlAsync(baseUrl, storyName);
  }
  if (system === 'histoire') {
    return histoire.buildTestUrlAsync(baseUrl, storyName);
  }
  throw new Error('Histoire not implemented yet');
}

export async function fetchStories(baseUrl: string): Promise<StoryMetaData[]> {
  if (system === 'storybook') {
    return storybook.fetchStories(baseUrl);
  }
  if (system === 'histoire') {
    return histoire.fetchStories(baseUrl);
  }
  throw new Error('Histoire not implemented yet');
}
