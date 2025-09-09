export function getCallerFile(lookXUp = 1): string {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalPrepareStackTrace = Error.prepareStackTrace;

  try {
    Error.prepareStackTrace = (_, stack) => stack;

    const err = new Error();
    const stack = err.stack as unknown as NodeJS.CallSite[];

    const number = lookXUp + 1; // +1 because the first entry is this function itself
    if (stack.length > number) {
      const callerFile = stack[number].getFileName();
      if (callerFile) {
        return callerFile.replace(/^file:\/\//, '');
      }
    }

    throw new Error('Could not determine the caller file');
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
}
