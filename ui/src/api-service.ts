import { type NavigateFunction } from 'react-router-dom';
import type { TApiResponse, TEpisodePosition, TNowPlaying, TPodcast, TSignIn, TSignUp } from '@/types';

/* API calls */

export function getEpisodes(navigate: NavigateFunction, podcastId: string, beforeId?: string) {
  const beforeQuery = (beforeId) ? `&before_id=${ beforeId }` : '';
  return callApi<TEpisodePosition[]>(navigate, `/api/v1/episodes?limit=50&podcast_id=${ podcastId }${ beforeQuery }`, {
    method: 'GET',
  });
}

export function patchEpisodePosition(navigate: NavigateFunction, episodeId: string, completed: boolean, currentTime: number, realDuration: number) {
  return callApi<TNowPlaying>(navigate, `/api/v1/episodes/${ episodeId }/position`, {
    method: 'PATCH',
    body: JSON.stringify({ completed, 'current_time': currentTime, 'real_duration': realDuration }),
  });
}

export function getNowPlaying(navigate: NavigateFunction) {
  return callApi<TNowPlaying>(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  });
}

export function putNowPlaying(navigate: NavigateFunction, episodeId: string) {
  return callApi<TNowPlaying>(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': episodeId }),
  });
}

export function getSubscriptions(navigate: NavigateFunction) {
  return callApi<TPodcast[]>(navigate, `/api/v1/subscriptions`, {
    method: 'GET',
  });
}

export function postSubscription(navigate: NavigateFunction, rss: string) {
  return callApi<TPodcast>(navigate, `/api/v1/subscriptions`, {
    method: 'POST',
    body: JSON.stringify({ rss }),
  });
}

export function getSubscription(navigate: NavigateFunction, podcastId: string) {
  return callApi<TPodcast>(navigate, `/api/v1/subscriptions/${ podcastId }`, {
    method: 'GET',
  });
}

export function postSignIn(email: string, password: string, rememberMe: boolean) {
  return callApi<TSignIn>(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password, 'remember_me': rememberMe })
  });
}

export function postSignOut() {
  return callApi(null, '/api/v1/auth/sign-out', {
    method: 'POST'
  });
}

export function postSignUp(email: string, password: string) {
  return callApi<TSignUp>(null, '/api/v1/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

/* Helper methods */

async function callApi<T>(navigate: NavigateFunction | null, resource: string, options={}) : Promise<TApiResponse<T>> {
  const res = await fetch(resource, options);
  if (res.status === 401 && navigate) {
    navigate('/sign-in');
  }
  let parsed = null;
  try {
    parsed = convertKeysToCamelCase<T>(await res.json())
  } catch { /* do nothing */ }
  return {
    data: parsed,
    ok: res.ok,
    status: res.status,
  };
}

export function convertKeysToCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        toCamelCase(key),
        convertKeysToCamelCase(value),
      ])
    ) as T;
  }
  return obj as T;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}
