import { type NavigateFunction } from 'react-router-dom';
import type { TEpisodePosition, TNowPlaying, TApiResponse, TPodcast, TSignIn, TSignUp } from '@/types';

async function callApi(navigate: NavigateFunction | null, resource: string, options={}) : Promise<TApiResponse<any>> {
  const res = await fetch(resource, options);
  if (res.status === 401 && navigate) {
    navigate('/sign-in');
  }
  let parsed = null;
  try {
    parsed = await res.json()
  } catch {}
  return {
    data: parsed,
    ok: res.ok,
    status: res.status,
  };
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
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


export async function getEpisodes(navigate: NavigateFunction, id: string) {
  const res = await callApi(navigate, `/api/v1/episodes?podcast_id=${ id }`, {
    method: 'GET',
  });
  return convertKeysToCamelCase<TApiResponse<TEpisodePosition[]>>(res);
}

export async function patchEpisodeProgress(navigate: NavigateFunction, id: string, completed: boolean, currentTime: number, duration: number) {
  const res = await callApi(navigate, `/api/v1/episodes/${ id }/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ completed, 'current_time': currentTime, 'real_duration': duration }),
  });
  return convertKeysToCamelCase<TApiResponse<TNowPlaying | null>>(res);
}

export async function getNowPlaying(navigate: NavigateFunction) {
  const res = await callApi(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  });
  return convertKeysToCamelCase<TApiResponse<TNowPlaying | null>>(res);
}

export async function putNowPlaying(navigate: NavigateFunction, id: string) {
  const res = await callApi(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': id }),
  });
  return convertKeysToCamelCase<TApiResponse<TNowPlaying >>(res);
}

export async function getSubscriptions(navigate: NavigateFunction) {
  const res = await callApi(navigate, `/api/v1/subscriptions`, {
    method: 'GET',
  });
  return convertKeysToCamelCase<TApiResponse<TPodcast[]>>(res);
}

export async function postSubscription(navigate: NavigateFunction, rss: string) {
  const res = await callApi(navigate, `/api/v1/subscriptions`, {
    method: 'POST',
    body: JSON.stringify({ rss }),
  });
  return convertKeysToCamelCase<TApiResponse<TPodcast>>(res);
}

export async function getSubscription(navigate: NavigateFunction, id: string) {
  const res = await callApi(navigate, `/api/v1/subscriptions/${ id }`, {
    method: 'GET',
  });
  return convertKeysToCamelCase<TApiResponse<TPodcast>>(res);
}

export async function postSignIn(email: string, password: string) {
  const res = await callApi(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return convertKeysToCamelCase<TApiResponse<TSignIn>>(res);
}

export async function postSignUp(email: string, password: string) {
  const res = await callApi(null, '/api/v1/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return convertKeysToCamelCase<TApiResponse<TSignUp>>(res);
}
