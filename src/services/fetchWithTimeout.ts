/**
 * fetchWithTimeout.ts
 * Unified fetch wrapper with strict AbortController timeout.
 * Ensures zero-cost public APIs never hang or block the client UI.
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
}

export class TimeoutError extends Error {
  constructor(message: string = 'Network request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Executes a fetch request with an enforced timeout via AbortController.
 * Defaults to 2500ms per Sheriyakam architectural guidelines.
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = 2500, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new TimeoutError(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
