import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './copyToClipboard';

const TEXT = 'https://ai-explore.test/tools/midjourney';

describe('INV-18: copyToClipboard falls back and never throws', () => {
  let copiedByFallback: string | undefined;
  const execCommand = vi.fn<(command: string) => boolean>();

  const setClipboard = (clipboard: unknown) => {
    Object.defineProperty(window.navigator, 'clipboard', {
      value: clipboard,
      configurable: true,
      writable: true,
    });
  };

  beforeEach(() => {
    copiedByFallback = undefined;
    execCommand.mockReset();
    execCommand.mockImplementation(() => {
      copiedByFallback = document.querySelector('textarea')?.value;
      return true;
    });
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(window.navigator, 'clipboard');
    Reflect.deleteProperty(document, 'execCommand');
    document.body.innerHTML = '';
  });

  it('resolves true through the Clipboard API without the fallback', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    setClipboard({ writeText });
    await expect(copyToClipboard(TEXT)).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith(TEXT);
    expect(execCommand).not.toHaveBeenCalled();
  });

  it('falls back to a temporary textarea and execCommand when writeText rejects', async () => {
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));
    setClipboard({ writeText });
    await expect(copyToClipboard(TEXT)).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith(TEXT);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(copiedByFallback).toBe(TEXT);
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('falls back when the Clipboard API is undefined', async () => {
    setClipboard(undefined);
    await expect(copyToClipboard(TEXT)).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(copiedByFallback).toBe(TEXT);
    expect(document.querySelector('textarea')).toBeNull();

    execCommand.mockClear();
    setClipboard({});
    await expect(copyToClipboard(TEXT)).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('resolves the fallback result and never rejects when the fallback fails', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('blocked')) });
    execCommand.mockReturnValue(false);
    await expect(copyToClipboard(TEXT)).resolves.toBe(false);

    execCommand.mockImplementation(() => {
      throw new Error('execCommand unsupported');
    });
    await expect(copyToClipboard(TEXT)).resolves.toBe(false);
  });
});
