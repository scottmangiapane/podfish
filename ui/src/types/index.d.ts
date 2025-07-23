export interface TApiResponse<T> {
  data: T | null;
  ok: boolean;
  status: number;
}

export interface TEpisode {
  date: string;
  description: string;
  duration: number;
  episodeId: string;
  title: string;
  url: string;
}

export interface TEpisodePosition {
  episode: TEpisode;
  position: TPosition;
}

export interface TNowPlaying {
  episode: TEpisode;
  podcast: TPodcast;
  position: TPosition | null;
}

export interface TPosition {
  completed: boolean;
  currentTime: number;
  realDuration: number;
}

export interface TSignIn {
  email: string;
  password: string;
}

export interface TSignUp {
  email: string;
  userId: string;
}

export interface TPodcast {
  color: string;
  description: string;
  imageId: string;
  podcastId: string;
  title: string;
}
