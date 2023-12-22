import { HomeIcon, SearchIcon, LibraryIcon, HeartIcon, RssIcon, PlayIcon, PlusCircleIcon } from '@heroicons/react/outline';

import {signOut, useSession} from "next-auth/react";
import {useState, useEffect} from "react";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import {playlistIdState} from "../atoms/playlistAtom"; 


function Sidebar() {
      const spotifyApi = useSpotify();
      const {data: session,status} =useSession();
      const [playlists,setPlaylists] = useState([]);
      const [playlistId,setPlaylistsId] = useRecoilState(playlistIdState);

      console.log("you picked playlist >>> ",playlistId);
      
      useEffect(() => {
         if (spotifyApi.getAccessToken()){
           spotifyApi.getUserPlaylists().then((data)=>{
                setPlaylists(data.body.items);
           });
         }
      }, [session,spotifyApi]);
      console.log(playlists); 


      return (
            <div className=" text-[#b3b3b3] py-[10px] px-[9px] text-base  bg-[#000000]  ">
                  <div className=' w-[100px] sm:min-w-[316px]   space-y-4 bg-[#121212]  py-[8px] px-[20px] rounded-md   '>
                        <button className="flex items-center space-x-4 hover:text-white ">
                           <HomeIcon className="h-5 w-5 " />
                           <p className='hidden sm:block'>Home</p>
                        </button>
                        <button className="flex items-center space-x-4 hover:text-white">
                           <SearchIcon className="h-5 w-5" />
                           <p className='hidden sm:block'>Search</p>
                        </button>
                        <button className="flex items-center space-x-4 hover:text-white">
                           <LibraryIcon className="h-5 w-5" />
                           <p className='hidden sm:block'>Library</p>
                        </button>
                  </div>
                  <div className='space-y-4 bg-[#121212] w-[100px] sm:min-w-[316px] py-[8px] px-[20px] mt-[8px] rounded-md h-[501px] sm:min-h-[500px] overflow-hidden wrapper hover:overflow-y-scroll '>
                        <button className="flex items-center space-x-4 hover:text-white">
                           <PlusCircleIcon className="h-5 w-5 " />
                           <p className='hidden sm:block'>Create Playlist</p> 
                        </button>
                        <button className="flex items-center space-x-4 hover:text-white">
                           <HeartIcon className="h-5 w-5 text-[#4cc94c]" />
                           <p className='hidden sm:block'>Liked Songs</p>
                        </button>
                        <button className="flex items-center space-x-4 hover:text-white">
                           <RssIcon className="h-5 w-5 text-blue-500" />
                           <p className='hidden sm:block'>Your episodes</p>
                        </button>
                        <hr className="border-t-[0.1px] border-[#252020] hidden sm:block" />
                        
                        
                     {/* playlists */}
                     {playlists.map((playlist)=>(
                        <div key={playlist.id} className="h-[60px] w-[60px] sm:min-w-[275px] py-[5px] px-[5px]  rounded-md cursor-pointer hover:bg-[#4e4a4a] "
                           onClick={() => setPlaylistsId(playlist.id)} >
                           <div className="grid  grid-cols-[50px] grid-rows-2 gap-x-4 gap-y-1 ">
                              <img className="row-span-4 rounded-md "src = {playlist?.images?.[0].url} alt=""/>                   
                              <div className="col-span-2 row-span-2 col-start-2 row-start-1  text-[white] hover:text-[#1ed760] text-lg font-medium hidden sm:block">{playlist.name}</div>
                              <div className='col-span-2 row-span-1  text-[#b3afaf] text-sm hidden sm:block'>Playlist . <span>{session?.user.name}</span></div>
                           </div>
                        </div>                       
                     ))}   
                  </div>
            </div>
      )
}

export default Sidebar;
