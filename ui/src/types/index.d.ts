export interface TApiResponse<T> {
  data: T;
  ok: boolean;
  status: number;
}

export interface TEpisode {
  date: string;
  description: string;
  episode_id: string;
  title: string;
  url: string;
}

export interface TEpisodePosition {
  episode: TEpisode;
  position: TPosition;
}

export interface TNowPlaying {
  episode: TEpisode;
  podcast: TSubscription; // TODO consistent naming between "podcast" and "subscription"
  position: TPosition;
}

export interface TPosition {
  current_time: number;
}

export interface TSignIn {
  email: string;
  password: string;
}

export interface TSignUp {
  email: string;
  user_id: string;
}

export interface TSubscription {
  description: string;
  image_id: string;
  podcast_id: string;
  title: string;
}
