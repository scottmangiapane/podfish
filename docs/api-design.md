All routes are prefixed with `/api/v1`.

# Authentication

- POST /auth/reset-password
- PATCH /auth/reset-password/{token}
- POST /auth/sign-in
- POST /auth/sign-out
- POST /auth/sign-up

# Episodes

- GET /episodes
- GET /episodes/{id}
- PATCH /episodes/{id}/completed
- PATCH /episodes/{id}/current-time

# Now playing

- GET /now-playing
- PUT /now-playing
- DELETE /now-playing

# Subscriptions

- GET /subscriptions
- POST /subscriptions
- GET /subscriptions/{id}
- DELETE /subscriptions/{id}

Note: ability to request metadata refresh may be needed if backend service is slow.

# Users

- PATCH /users/{id}/email
- PATCH /users/{id}/password

Note: password resets are separate since the user ID isn't known before sign-in.
