/**
 * Safe wrappers around Web Storage. Storage can be blocked (private
 * windows, strict privacy settings), so every access is guarded and the
 * app keeps working without it.
 */
type StorageKind = 'local' | 'session';

function getStorage(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readJson<T>(kind: StorageKind, key: string): T | null {
  try {
    const raw = getStorage(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(kind: StorageKind, key: string, value: unknown): void {
  try {
    const storage = getStorage(kind);
    if (value === null || value === undefined) {
      storage?.removeItem(key);
    } else {
      storage?.setItem(key, JSON.stringify(value));
    }
  } catch {
    /* Storage unavailable: keep state in memory only. */
  }
}

/** Expires the named first-party cookies on this domain. */
export function deleteCookies(names: readonly string[]): void {
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  }
}
