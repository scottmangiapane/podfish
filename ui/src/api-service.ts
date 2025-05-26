import { NavigateFunction } from 'react-router-dom';

async function callApi(navigate: NavigateFunction | null, resource: string, options={}) {
  const res = await fetch(resource, options);
  if (res.status === 401 && navigate) {
    navigate('/sign-in');
  }
  return res;
}

export function getEpisodes(navigate: NavigateFunction, id: string) {
  return callApi(navigate, `/api/v1/episodes?podcast_id=${ id }`, {
    method: 'GET'
  });
}

export function getNowPlaying(navigate: NavigateFunction) {
  return callApi(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  });
}

export function putNowPlaying(navigate: NavigateFunction, id: string) {
  return callApi(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': id })
  });
}

export function getSubscription(navigate: NavigateFunction, id: string) {
  return callApi(navigate, `/api/v1/subscriptions/${ id }`, {
    method: 'GET'
  });
}

export function getSubscriptions(navigate: NavigateFunction) {
  return callApi(navigate, `/api/v1/subscriptions`, {
    method: 'GET'
  });
}

export function postSignIn(email: string, password: string) {
  return callApi(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function postSignUp(email: string, password: string) {
  return callApi(null, '/api/v1/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
