import { useEffect, useRef, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";
import { useImmer } from "use-immer";

import { getEpisodes, getSubscription } from "@/api-service";
import { useAppContext } from "@/contexts/AppContext";
import Collapsable from "@/components/Collapsable";
import Cover from "@/components/Cover";
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

  const descriptionClean = sanitizeHtml(podcast.description, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return (
    <div className="podcast-split">
      <div className="podcast-split-left">
        <div className="podcast-header">
          <Cover
            color={ podcast.color }
            src={ `/file/${ podcast.imageId }-lg.jpeg` }
            style={{
              borderRadius: "8px",
              boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, "
                + "rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              overflow: "hidden",
              width: "100%"
            }} />
          <div className="break-word">
            <h3 className="break-word podcast-title">{ podcast.title }</h3>
            <Collapsable lines={ 6 } text={ descriptionClean } />
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
