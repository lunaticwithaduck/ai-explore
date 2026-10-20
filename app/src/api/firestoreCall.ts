import { type AppError, toAppError } from './errors';

export async function firestoreCall<T>(
  run: () => Promise<T>,
): Promise<{ data: T } | { error: AppError }> {
  try {
    return { data: await run() };
  } catch (error) {
    return { error: toAppError(error) };
  }
}
