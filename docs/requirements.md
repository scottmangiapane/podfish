# Basic Functionality

_Bare minimum required for launch_

- API and web app client
  - Designed to support future cross-platform development
  - Platforms ranked by priority:
    1. Web app
    2. PWA (as a lightweight mobile solution pre-native apps)
    3. Mobile apps (not required for launch)
  - No desktop apps or browser extensions

- Account management
  - Account creation
  - Change email
  - Change password
  - Reset password (account recovery if locked out)

- Add RSS feed by link

- Podcast list
  - Display list of subscribed podcasts
  - Show podcast icon
  - Show podcast metadata (title, description, etc.)

- Episode list
  - Display list of episodes
  - Show episode metadata (title, description, runtime, etc.)
  - Indicate previously played episodes
  - Mark episode as played or unplayed

- Media playback
  - Show podcast icon
  - Show episode metadata
  - Playback controls: play, pause, skip back/forward, and playback timeline
  - Remember playback position

- Sync all data across devices

---

# Advanced Functionality

_Likely to be implemented, but not required for launch_

- OPML import
- Search within subscriptions
- Import podcasts from another app
- Queueing system / “Up Next”
- Delete account
- Multi-factor authentication (MFA)
- Download episodes for offline playback
- Notifications for new episode releases
- Social integration (e.g., share button)

---

# Out of Scope Functionality

_Relevant, but unlikely to be implemented_

- Podcast playlists
  - Default “Favorites” playlist with shortcut from episode playback
  - Custom user-defined playlists

- Podcast catalog
  - Discover podcasts via third-party API (e.g., podchaser.com, listennotes.com)
    - Top podcasts overall
    - Top podcasts by category
    - Personalized recommendations based on subscriptions
  - Add podcasts from catalog
  - Search for podcasts in catalog

- Public user profiles
  - (Optional) Show what podcasts a user subscribes to
  - (Optional) Show what episodes a user has listened to
  - User avatars
  - User bios
  - Follow other users

- Podcast hosting
  - Download and re-host podcast files across a CDN
