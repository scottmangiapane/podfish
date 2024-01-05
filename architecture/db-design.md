# Users

- ID (primary key, uuid)
- email
- hashed password
- created timestamp
- destroyed timestamp

# Subscriptions

- ID (primary key, uuid)
- feed URL

# Episodes

- ID (primary key, uuid)
- FK to subscription ID

Note: additional data required to match with data from RSS feeds

# Playback positions

- FK to user ID (composite key component)
- FK to episode ID (composite key component)
- completed
- timestamp
- last listened to timestamp

# Now playing

- FK to user ID (primary key)
- FK to episode ID
