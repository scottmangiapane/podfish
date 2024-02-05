async function callApi(navigate, resource, options={}) {
  const res = await fetch(resource, options);
  if (res.status === 401) {
    navigate('/sign-in');
  }
  return res;
}

export function getEpisodes(navigate, id) {
  return callApi(navigate, `/api/v1/episodes?podcast_id=${ id }`, {
    method: 'GET'
  });
}

export function getNowPlaying(navigate) {
  return callApi(navigate, `/api/v1/now-playing`, {
    method: 'GET'
  });
}

export function putNowPlaying(navigate, id) {
  return callApi(navigate, `/api/v1/now-playing`, {
    method: 'PUT',
    body: JSON.stringify({ 'episode_id': id })
  });
}

export function getSubscription(navigate, id) {
  return callApi(navigate, `/api/v1/subscriptions/${ id }`, {
    method: 'GET'
  });
}

export function getSubscriptions(navigate) {
  return callApi(navigate, `/api/v1/subscriptions`, {
    method: 'GET'
  });
}

export function postSignIn(email, password) {
  return callApi(null, '/api/v1/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function postSignUp(email, password) {
  return callApi(null, '/api/v1/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
