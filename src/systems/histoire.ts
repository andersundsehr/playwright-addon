interface StoryMetaData {
  id: string;
  title: string;
  name: string;
}

export interface HistoireStoryMetaData extends StoryMetaData {
  url: string;
  selector: '#storybook-root';
  storyPath: string;
}

export async function fetchStories(baseUrl: string): Promise<HistoireStoryMetaData[]> {
  throw new Error('TODO implement fetchStories for histoire');
}

export async function buildTestUrlAsync(baseUrl: string, storyName: string): Promise<string> {
  throw new Error('TODO implement buildTestUrlAsync for histoire');
}
