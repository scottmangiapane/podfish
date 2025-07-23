import { useEffect, useRef, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";
import { useImmer } from "use-immer";

import { getEpisodes, getSubscription } from "@/api-service";
import { useAppContext } from "@/contexts/AppContext";
import Episode from "@/podcast/Episode";
import type { TEpisodePosition, TPodcast } from "@/types";

import "@/podcast/Podcast.css";

function Podcast() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { podcastId } = useParams();
  const containerRef = useRef(null);
  const [episodes, updateEpisodes] = useImmer(new Map<string, TEpisodePosition>);
  const [beforeId, setBeforeId] = useState<string | undefined>();
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [podcast, setPodcast] = useState<TPodcast | null>(null);

  function loadEpisodes() {
    if (isLoadingEpisodes || !hasMoreEpisodes) {
      return;
    }
    setIsLoadingEpisodes(true);
    getEpisodes(navigate, podcastId!, beforeId).then((res) => {
      if (res.ok && res.data) {
        if (res.data.length) {
          updateEpisodes((draft) => {
            res.data!.forEach((episode) => draft.set(episode.episode.episodeId, episode));
          });
          setBeforeId(res.data.at(-1)?.episode?.episodeId);
        } else {
          setHasMoreEpisodes(false);
        }
      }
      setIsLoadingEpisodes(false);
    });
  }

  useEffect(() => {
    loadEpisodes();
    getSubscription(navigate, podcastId!).then((res) => {
      if (res.ok && res.data) {
        setPodcast(res.data);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            loadEpisodes();
        }
    }, { threshold: 1 });

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el)  observer.unobserve(el);
    };
  }, [loadEpisodes]);

  useEffect(() => {
    if (state.nowPlaying?.position) {
      const { episodeId } = state.nowPlaying.episode;
      const { currentTime, realDuration } = state.nowPlaying.position;
      updateEpisodes((draft) => {
        const episode = draft.get(episodeId);
        if (episode) {
          episode.position = episode.position || {
            completed: false,
            currentTime: currentTime,
            realDuration: realDuration,
          };
          episode.position.currentTime = currentTime;
          episode.position.realDuration = realDuration;
        }
      });
    }
  }, [state.nowPlaying?.position]);

  if (!podcast) {
    return null;
  }

  const episodeList: ReactElement[] = [];
  for (const { episode, position } of episodes.values()) {
    episodeList.push(
      <div className="podcast-list-item" key={ episode.episodeId }>
        <Episode episode={ episode } podcast={ podcast } position={ position } />
      </div>
    );
  }

  const cleanDescription = sanitizeHtml(podcast.description, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return (
    <div className="podcast-split">
      <div className="podcast-split-left">
        <div className="podcast-header">
          <img className="podcast-cover" src={ `/file/${ podcast.imageId }-lg.jpeg` }></img>
          <div className="break-word">
            <h3 className="break-word podcast-title">{ podcast.title }</h3>
            <p className={ "break-word " + (isCollapsed && "truncate-l truncate-6l") }>
              { cleanDescription }
            </p>
            <span className="btn symbol" onClick={ () => setIsCollapsed(!isCollapsed) }>
              { (isCollapsed) ? "expand_more" : "expand_less" }
            </span>
            {/* TODO unsubscribe button? */}
          </div>
        </div>
      </div>
      <div className="podcast-split-right">
        <div className="podcast-list">
          { episodeList }
          {/* TODO make these more aesthetic */}
          { isLoadingEpisodes && <p>Loading more episodes...</p> }
          { !hasMoreEpisodes && <p>No more episodes</p> }
          <div ref={ containerRef } style={{ height: 0 }} />
        </div>
      </div>
    </div>
  );
}

export default Podcast;
