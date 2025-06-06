import { type NavigateFunction } from 'react-router-dom';
import type { TApiResponse, TEpisodePosition, TNowPlaying, TPodcast, TSignIn, TSignUp } from '@/types';

/* API calls */

export function getEpisodes(navigate: NavigateFunction, id: string) {
  return callApi<TEpisodePosition[]>(navigate, `/api/v1/episodes?podcast_id=${ id }`, {
    method: 'GET',
  });
}

export function patchEpisodeProgress(navigate: NavigateFunction, id: string, completed: boolean, currentTime: number, duration: number) {
  return callApi<TNowPlaying>(navigate, `/api/v1/episodes/${ id }/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ completed, 'current_time': currentTime, 'real_duration': duration }),
  });
}

export function getNowPlaying(navigate: NavigateFunction) {
  return callApi<TNowPlaying>(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  });
}

export function putNowPlaying(navigate: NavigateFunction, id: string) {
  return callApi<TNowPlaying>(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': id }),
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

export function getSubscription(navigate: NavigateFunction, id: string) {
  return callApi<TPodcast>(navigate, `/api/v1/subscriptions/${ id }`, {
    method: 'GET',
  });
}

export function postSignIn(email: string, password: string) {
  return callApi<TSignIn>(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password })
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
  } catch {}
  return {
    data: parsed,
    ok: res.ok,
    status: res.status,
  };
}

function convertKeysToCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item)) as any;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        convertKeysToCamelCase(value),
      ])
    ) as T;
  }
  return obj;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
