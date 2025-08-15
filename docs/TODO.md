SECURITY

- Add HTTP security headers
- Investigate if `http.Dir` following symlinks allows malicious RSS feeds to read arbitrary files
- Block RSS feeds (or images within feeds) from invalid/internal domains (ex: localhost, docker hostnames like `api:3000`, `0.0.0.0`)

FEATURES

- Account management
- Admin page with queue insights
- Generate transcripts
- Episode summaries (AI)
- Automatic chapter markers (AI)
- Automatic episode tags (AI)
- Wrap website in Capacitor app (mobile, ex: Burger King / Popeyes) or use PWA
- Wrap website in Electron app (desktop)

API ENHANCEMENTS

- Investigate and fix bug where tasks get stuck
- Fix excessive worker logs
- Use `etag` / `last_modified` headers for conditional GETs to save bandwidth
- Use actual migration files instead of GORM's auto-migrate
- Validate that new RSS feeds are actually valid RSS
- Handle when a podcast feed is removed (retain metadata but show error in UI)
- Handle when an individual episode is removed (retain metadata but hide from UI)
- Consider removing `Completed` boolean (not used in UI)
- Simplify error handling (ex: checking for a GORM "not found" error before falling back to a 500)

UI ENHANCEMENTS

- Enable automatic linting on save (ex: consistent quotes)
- Add a loading animation while podcast is being added
- Improve error handling for sign up / sign in
- Fix inconsistent play icons and cover image sizes on mobile
- Implement search functionality
- Ensure Docker reflects added/removed Node dependencies (may require rethinking `.dockerignore` or volumes; live reload limitations?)
