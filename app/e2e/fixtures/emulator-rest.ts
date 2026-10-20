const base = () =>
  `http://127.0.0.1:${process.env.FIRESTORE_PORT}/v1/projects/demo-ai-explore/databases/(default)/documents`;

export const emulatorRest = (path: string, init: RequestInit = {}) =>
  fetch(`${base()}/${path}`, {
    ...init,
    headers: { Authorization: 'Bearer owner', ...(init.headers ?? {}) },
  });
