// _shared/lib/fetcher.ts
export const apiFetch = async (
  path: string,
  options?: RequestInit,
): Promise<any> => {
  const res = await fetch(`${window.location.origin}${path}`, options);
  return res;
};
