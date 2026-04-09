const DEFAULT_API_BASE_URL = "http://localhost:5000";

function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  return (
    process.env.INTERNAL_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
}

function getApiUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    ...init,
    cache: init?.cache ?? "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string })?.message || `Request failed for ${path}`,
      response.status,
      data,
    );
  }

  return data as T;
}
