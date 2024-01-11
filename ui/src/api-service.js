async function callApi(navigate, resource, options={}) {
  const res = await fetch(resource, options);
  if (res.status === 401) {
    navigate('/sign-in');
  }
  return await res.json();
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
