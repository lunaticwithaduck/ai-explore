import { emulatorRest } from './emulator-rest';

type ListResponse = { documents?: { name: string }[] };

export async function resetUnreviewedTool(slug: string) {
  const list = (await (await emulatorRest(`tools/${slug}/reviews`)).json()) as ListResponse;
  for (const document of list.documents ?? []) {
    const id = document.name.split('/').pop();
    if (id) await emulatorRest(`tools/${slug}/reviews/${id}`, { method: 'DELETE' });
  }
  await emulatorRest(`tools/${slug}?updateMask.fieldPaths=rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        rating: {
          mapValue: { fields: { count: { integerValue: '0' }, sum: { integerValue: '0' } } },
        },
      },
    }),
  });
}
