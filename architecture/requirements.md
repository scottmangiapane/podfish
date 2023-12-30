# Basic Functionality

(bare minimum required for launch)

- API and web app client
    - designed to become cross-platform later
    - platforms ranked by priority:
        1. web app
        2. PWA (as an easy compromise before actual native mobile apps)
        3. mobile apps (not required for launch)
    - NO desktop apps or browser extensions
- account management
    - account creation
    - change email
    - change password
    - reset password (account recovery when locked out)
- add RSS feed by link
- podcast list
    - display list of podcasts
    - display podcast icon
    - display podcast metadata (title, description, etc)
- episode list
    - display list of episodes
    - display episode metadata (title, description, runtime, etc)
    - indicate previously played episodes
    - mark episode as played / not played
- media playback
    - show podcast icon
    - show episode metadata
    - pause, play, back, forward, and timeline
    - remember playback position
- all data synchronized across devices

# Advanced Functionality

(likely to be implemented, but not for launch)

- search for podcasts in subscriptions
- import podcasts from another app
- queueing system / "Up Next"
- delete account
- mfa
- download episodes and offline playback
- notifications when new episodes are released
- social integration (share button)

# Out of Scope Functionality

(relevant, but not likely to be implemented)

- podcast playlists
    - default "favorites" playlist with shortcut on episode playback
    - custom playlists
- podcast catalog
    - discover podcasts from catalog (scraped from Apple? 3rd party API like listennotes.com?)
        - list of top podcasts
        - list of top podcasts by category
        - recommended podcasts based on current subscriptions
    - add podcasts from catalog
    - search for podcasts in catalog
- analytics for podcast hosts
- public user profiles
    - (optionally) show what individual users subscripe to
    - (optionally) show what episodes individual users have heard
    - user avatars
    - user bios
    - follow other users
- podcast hosting
    - download and rehost podcasts across CDN
