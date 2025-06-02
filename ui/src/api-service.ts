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

export async function getEpisodes(navigate: NavigateFunction, id: string) {
  return await callApi(navigate, `/api/v1/episodes?podcast_id=${ id }`, {
    method: 'GET',
  }) as TApiResponse<TEpisodePosition[]>;
}

export async function patchEpisodeCurrentTime(navigate: NavigateFunction, id: string, currentTime: number) {
  return await callApi(navigate, `/api/v1/episodes/${ id }/current-time`, {
    method: 'PATCH',
    body: JSON.stringify({ 'current_time': currentTime }),
  }) as TApiResponse<TNowPlaying | null>;
}

export async function getNowPlaying(navigate: NavigateFunction) {
  return await callApi(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  }) as TApiResponse<TNowPlaying | null>;
}

export async function putNowPlaying(navigate: NavigateFunction, id: string) {
  return await callApi(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': id }),
  }) as TApiResponse<TNowPlaying >;
}

export async function getSubscription(navigate: NavigateFunction, id: string) {
  return await callApi(navigate, `/api/v1/subscriptions/${ id }`, {
    method: 'GET',
  }) as TApiResponse<TPodcast>;
}

export async function getSubscriptions(navigate: NavigateFunction) {
  return await callApi(navigate, `/api/v1/subscriptions`, {
    method: 'GET',
  }) as TApiResponse<TPodcast[]>;
}

export async function postSignIn(email: string, password: string) {
  return await callApi(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }) as TApiResponse<TSignIn>;
}

export async function postSignUp(email: string, password: string) {
  return await callApi(null, '/api/v1/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }) as TApiResponse<TSignUp>;
}
