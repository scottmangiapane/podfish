import { NavigateFunction } from 'react-router-dom';

export interface Response<T> {
  data: T;
  ok: boolean;
  status: number;
}

export interface TEpisode {
  date: string;
  description: string;
  episode_id: string;
  title: string;
  url: string;
}

export interface TEpisodePosition {
  episode: TEpisode;
  position: TPosition;
}

export interface TNowPlaying {
  episode: TEpisode;
  podcast: TSubscription; // TODO consistent naming between "podcast" and "subscription"
  position: TPosition;
}

export interface TPosition {
  current_time: string;
}

export interface TSubscription {
  description: string;
  image_id: string;
  podcast_id: string;
  title: string;
}

export interface TSignIn {
  email: string;
  password: string;
}

export interface TSignUp {
  email: string;
  user_id: string;
}

async function callApi(navigate: NavigateFunction | null, resource: string, options={}) : Promise<Response<any>> {
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
    method: 'GET'
  }) as Response<TEpisodePosition[]>;
}

export async function getNowPlaying(navigate: NavigateFunction) {
  return await callApi(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  }) as Response<TNowPlaying | null>;
}

export async function putNowPlaying(navigate: NavigateFunction, id: string) {
  return await callApi(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': id })
  }) as Response<TNowPlaying >;
}

export async function getSubscription(navigate: NavigateFunction, id: string) {
  return await callApi(navigate, `/api/v1/subscriptions/${ id }`, {
    method: 'GET'
  }) as Response<TSubscription>;
}

export async function getSubscriptions(navigate: NavigateFunction) {
  return await callApi(navigate, `/api/v1/subscriptions`, {
    method: 'GET'
  }) as Response<TSubscription[]>;
}

export async function postSignIn(email: string, password: string) {
  return await callApi(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }) as Response<TSignIn>;
}

export async function postSignUp(email: string, password: string) {
  return await callApi(null, '/api/v1/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }) as Response<TSignUp>;
}
