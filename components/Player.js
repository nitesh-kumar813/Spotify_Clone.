

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
// import useAudioPlayer from '../hooks/useAudioPlayer';
import usesongInfo from "../hooks/useSongInfo";
import { debounce } from "lodash";


import {
  SwitchHorizontalIcon,
  
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  VolumeUpIcon,
  PlayIcon,
  FastForwardIcon,
  PauseIcon,
  ReplyIcon,
  HeartIcon,
} from "@heroicons/react/solid";


const audio = typeof Audio !== 'undefined' ? new Audio() : null;

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =useRecoilState(currentTrackIdState);
//   const audioPlayer = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50); // Set initial volume to 50

  const songInfo = usesongInfo();
  const [tracks, setTracks] = useState(null); 
    

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing", data.body?.item);
        setCurrentIdTrack(data.body?.item.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };


const handlePlayPause = () => {
    if (isPlaying) {
      if (audio) {
        audio.pause();
        audio.removeEventListener('loadeddata', handleAudioLoaded);
        audio.removeEventListener('error', handleAudioError);
      }
    } else {
      if (currentTrackId && tracks) {
        const track = tracks.items.find((item) => item.track.id === currentTrackId);
  
        if (track) {
          const previewUrl = track.track.preview_url;
  
          if (previewUrl) {
            audio.src = previewUrl;
            audio.addEventListener('loadeddata', handleAudioLoaded);
            audio.addEventListener('error', handleAudioError);
            audio.play().catch((error) => {
              console.error('Play error:', error);
              setIsPlaying(false);
            });
          }
        }
      }
    }
  
    setIsPlaying(!isPlaying);
  };
  
  const handleAudioLoaded = () => {
    console.log('Audio loadeddata event:', audio.readyState);
    setTracks(null); // Adjust this line if needed
    // Additional logic if needed
  };
  
  const handleAudioError = (error) => {
    console.error('Audio error event:', error);
    setIsPlaying(false);
    // Additional error handling logic if needed
  };
    
    
    
    
    
    
    
//   useEffect(() => {
//     if (spotifyApi.getAccessToken() && !currentTrackId) {
//       fetchCurrentSong();
//       setVolume(50);
//     }
//   }, [currentTrackId, spotifyApi, session]);

//   useEffect(() => {
//     if (volume > 0 && volume < 100) {
//       debouncedAdjustVolume(volume);
//     }
//   }, [volume]);

//   const debouncedAdjustVolume = useCallback(
//     debounce((volume) => {
//       spotifyApi.setVolume(volume).catch((err) => {});
//     }, 400), 
//     []
//   );

  return (
    <div className="h-20 bg-gradient-to-b
     from-black to-black text-white grid grid-cols-3  text-xs
     md:text-base px-2 md:px-5 ">
      {/* left side */}
      <div className="flex items-center space-x-4 ">
        <img
          className="hidden md:inline h-[50px] w-[50px] rounded-md "
          src={songInfo?.album.images?.[0].url}
          alt=""
        />
        <div className="">
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
          
        </div>
        <HeartIcon  className="button hidden md:inline text-[#3ef031]"/>
        
    </div>
          
      {/* Center*/}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button text-[gray]" />
        <RewindIcon
        //   onClick={() => spotifyApi.skipToPrevious()} 
          className="button"
        />
        {isPlaying ? (
        <PauseIcon onClick={handlePlayPause} className="button w-[50px] h-[50px]" />
        ) : (
        <PlayIcon onClick={handlePlayPause} className="button w-[50px] h-[50px]" />
        )}

        <FastForwardIcon
        //   onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
        <ReplyIcon className="button text-[gray]" />
      </div>

      {/* Right side */}
      <div className="flex items-center
         space-x-3 md:space-x-4 justify-end pr-5"
      >
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}
export default Player;