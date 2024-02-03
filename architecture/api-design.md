All routes are prefixed with `/api/v1`.

# Authentication

- POST /auth/sign-in
- POST /auth/sign-out
- POST /auth/sign-up

# Episodes

- GET /episodes
- GET /episodes/{id}
- PATCH /episodes/{id}/completed
- PATCH /episodes/{id}/playback-position

# Now playing

- GET /now-playing
- PUT /now-playing
- DELETE /now-playing

Note: actual MP3 file will be streamed to client directly from 3rd party servers.

# Users

- POST /reset-password
- PATCH /reset-password/{token}
- PATCH /users/{id}/email
- PATCH /users/{id}/password

Note: password resets are separate since the user ID isn't known before sign-in.

# Subscriptions

- GET /subscriptions
- POST /subscriptions
- GET /subscriptions/{id}
- DELETE /subscriptions/{id}

Note: ability to request metadata refresh may be needed if backend service is slow.
