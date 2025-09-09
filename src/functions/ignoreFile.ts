import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { deleteUpwards, test } from '@andersundsehr/playwright-addon';

function getIgnoreFileName(fileEnding: string) {

  return test
    .info()
    .snapshotPath()
    .replace(/\.txt$/, fileEnding);
}

async function getIgnoreFileContent(fileEnding: string) {
  const consoleIgnoreFilename = getIgnoreFileName(fileEnding);
  await mkdir(dirname(consoleIgnoreFilename), { recursive: true });
  let fileContent = '';
  try {
    fileContent = await readFile(consoleIgnoreFilename, 'utf-8');
  } catch (e) {
    // return () => true; // no ignore file, do not filter anything
  }

  return fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

export async function createFilterFunction(fileEnding: string) {
  const ignores = await getIgnoreFileContent(fileEnding);

  return (value: string) => !ignores.includes(value); // exact match

  // For partial match use this:
  // return (log: string) => {
  //   return !ignores.some((ignore) => {
  //     // TODO decide if we support regex or not
  //     // if (ignore.startsWith('^') && ignore.endsWith('$')) {
  //       // use regex:
  //       // return new RegExp(ignore).test(value);
  //     // }
  //     return value.includes(ignore);
  //   });
  // };
}

export async function writeIgnoreFile(ignores: string[], fileEnding = '.consoleignore') {
  const ignoreFilename = getIgnoreFileName(fileEnding);
  if (ignores.length === 0) {
    await deleteUpwards(ignoreFilename);
    console.log('nothing to ignore, removed ' + ignoreFilename);
    return;
  }
  const set = new Set(ignores);
  const fileIgnores = new Set(await getIgnoreFileContent(fileEnding));
  // if ignores are exactly the same as before, do nothing
  if (fileIgnores.size === set.size && [...fileIgnores].every((v: string) => set.has(v))) {
    return;
  }
  const content: string = [...set].sort().join('\n') + '\n';
  await mkdir(dirname(ignoreFilename), { recursive: true });
  await writeFile(ignoreFilename, content);

  console.warn('Wrote ' + ignoreFilename + ' with ' + ignores.length + ' entries');
}
