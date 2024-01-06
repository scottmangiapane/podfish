# Users

- ID (primary key, uuid)
- email
- hashed password

# Podcasts

- ID (primary key, uuid)
- RSS feed URL

Note: additional data (title, description, etc) may be cached here for performance

# Episodes

- ID (primary key, uuid)
- FK to podcast ID

Note: additional data required to match with data from RSS feeds

# Subscriptions

- FK to user ID (composite key component)
- FK to podcast ID (composite key component)

# Playback positions

- FK to user ID (composite key component)
- FK to episode ID (composite key component)
- completed
- timestamp
- last listened to timestamp

# Now playing

- FK to user ID (primary key)
- FK to episode ID
