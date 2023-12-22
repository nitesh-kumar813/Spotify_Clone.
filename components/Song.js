import useSpotify from "../hooks/useSpotify"
import {msToMinAndSec} from "../lib/time";
import { currentTrackIdState,isPlayingState } from "../atoms/songAtom";
import {useRecoilState} from "recoil";

const audio = typeof Audio !== 'undefined' ? new Audio() : null;


function Song({ order, track }) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setcurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setisPlaying] = useRecoilState(isPlayingState);
  
    // const playSong = () => {
    //   setcurrentTrackId(track.track.id);
  
    //   audio.pause();
  
    //   if (track.track.preview_url) {
    //     audio.src = track.track.preview_url;
    //     audio.play();
    //     setisPlaying(true); // Set playback state to true when a song starts playing
    //   } else {
    //     console.log('No preview available for this song.');
    //   }
    // }; 
    
    const playSong = () => {
        setcurrentTrackId(track.track.id);
      
        audio.pause();
      
        if (track.track.preview_url) {
          audio.src = track.track.preview_url;
      
          audio.addEventListener('loadeddata', () => {
            console.log('Audio loadeddata event:', audio.readyState);
          });
      
          audio.addEventListener('error', (error) => {
            console.error('Audio error event:', error);
            setisPlaying(false);
          });
      
          audio.play();
          console.log('After - Audio Playing:', audio.seekable);
          setisPlaying(true);
        } else {
          console.log('No preview available for this song.');
          setisPlaying(false);
        }
      };
  
    return (
        <div id = "Song wrapper" className="grid grid-cols-2 text-[#938888] hover:text-white font-medium
        py-2 px-5 hover:bg-[#666363] rounded-lg cursor-pointer " onClick={playSong}>
            
            <div className="flex items-center space-x-4  md:w-[300px] w-[240px] ">
                <p>{order+1}</p>
                <img className="h-10 w-10 rounded-md" 
                src={track.track.album.images[0].url} alt=""
                />
                <div className="w-38 lg:w-64 truncate">
                    <p className="text-white">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-[180px]  ">
                <p className="w-40 hidden md:inline">{track.track.album.name}</p>
                <p >{msToMinAndSec(track.track.duration_ms)}</p>
            </div >
        </div>
    )
}

export default Song;