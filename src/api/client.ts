export const API_BASE = 'https://pokeapi.co/api/v2'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new ApiError(`Request to ${url} failed with ${response.status}`, response.status)
  }
  return response.json() as Promise<T>
}
