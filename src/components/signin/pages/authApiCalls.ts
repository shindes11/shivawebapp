import { ApiErrorPayload } from "../error/ApiErrorPayload";
// import '../../../app/api/auth/signout'

export async function authSignOutApiCall(signal?: AbortSignal) {
    const response = await fetch(
      `/api/auth/signout`,
      {
        method: 'DELETE',
        signal,
      },
    );
  
    if (!response.ok) {
      const payload = (await response.json()) as ApiErrorPayload;
      throw new Error(payload.errors?.[0]?.message);
    }
  }