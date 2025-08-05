SECURITY

- Set SameSite cookie attribute (ex: `c.SetSameSite(http.SameSiteLaxMode)`)
- Add HTTP security headers
- Investigate if `http.Dir` following symlinks allows malicious RSS feeds to read arbitrary files
- Block RSS feeds (or images within feeds) from invalid/internal domains (ex: localhost, docker hostnames like `api:3000`, `0.0.0.0`)

API

- Replace `fmt.Println` with `log.Println`
- Use `etag` / `last_modified` headers for conditional GETs to save bandwidth
- Implement account management
- Use actual migration files instead of GORM's auto-migrate
- Refresh JWT token as needed
- Validate that new RSS feeds are actually valid RSS
- Handle when a podcast feed is removed (retain metadata but show error in UI)
- Handle when an individual episode is removed (retain metadata but hide from UI)
- Replace `/sync` with a backend service
- Consider removing `Completed` boolean (not used in UI)
- Simplify error handling (ex: checking for a GORM "not found" error before falling back to a 500)

UI

- Add a loading animation while podcast is being added
- Implement account management
- Improve error handling for sign up / sign in
- Fix inconsistent play icons and cover image sizes on mobile
- Implement search functionality
- Ensure Docker reflects added/removed Node dependencies (may require rethinking `.dockerignore` or volumes; live reload limitations?)

OTHER

- Enable automatic linting on save (ex: consistent quotes)
- Wrap website in Android app
- Wrap website in iOS app
- Wrap website in Electron (desktop) app
