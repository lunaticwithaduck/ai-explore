export const SERVER_READ_TIMEOUT_MS = 4000;

export class ServerReadTimeoutError extends Error {
  readonly code = 'unavailable';

  constructor(ms: number) {
    super(`Firestore read exceeded ${ms} ms`);
    this.name = 'ServerReadTimeoutError';
  }
}

export async function withTimeout<T>(
  work: Promise<T>,
  ms: number = SERVER_READ_TIMEOUT_MS,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ServerReadTimeoutError(ms)), ms);
  });
  try {
    return await Promise.race([work, expiry]);
  } finally {
    clearTimeout(timer);
  }
}
