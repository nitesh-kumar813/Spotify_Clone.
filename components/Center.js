import { useSession } from "next-auth/react";
import {ChevronDownIcon} from "@heroicons/react/outline";
import { useEffect,useState } from "react";
import {shuffle} from "lodash";
import {useRecoilState,useRecoilValue} from "recoil";
import {playlistIdState,playlistState} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "../components/Songs";
import { signOut } from "next-auth/react";
import { ClockIcon } from "@heroicons/react/outline";
const colors=[
    "from-indigo-500",
    "from-blue-400",
    "from-green-500",
    "from-yellow-500",
    "from-orange-500",
    "from-pink-500",
    "from-purple-500",
    "from-[#eb3156]",
    "from-[#e999c4]",
    "from-[#7BA0C7]",
    "from-[#47BDB7]",
];


export default function Center() {
    const {data:session} = useSession();
    const spotifyApi = useSpotify();
    const [color,setColor] = useState(null);

    const playlistId = useRecoilValue(playlistIdState);
    const [playlist,setPlaylist] = useRecoilState(playlistState);

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);
    

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data)=>{
            setPlaylist(data.body);
        })
        .catch((err) => console.log("We got an error!",err));
 
    }, [spotifyApi, playlistId]);  
    console.log(playlist);
    

    const handleSignOut = async () => {
        const result = await signOut({ callbackUrl: '/login' });
        console.log("result",result);
      };

    
      
    
    return (
        <div className="flex-grow h-[629px]  my-[10px] mr-[10px] b rounded-md  wrapper  ">
             <header className="absolute  top-5 right-8 ">
                <div id="User tag" className="flex items-center bg-[black]
                space-x-3 opacity-90 hover:opacity-80 cursor-pointer 
                 rounded-full p-1  text-white"  onClick={handleSignOut} >
                    <img className="rounded-full w-10 h-10" 
                    src={session?.user.image} alt="" />

                    {session?.user.name ? (
                    <h2>{session.user.name}</h2>
                    ) : (
                    <h2 className="text-[#5ad15a]">SignIn</h2>
                    )}
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section 
                className={
                    `bg-gradient-to-b to-[#121212] ${color}
                     text-white p-7 pb-0  `
                }>
                <div className="flex items-end space-x-7 h-80 ">
                    <img className="h-[206px] w-[206px] shadow-2xl rounded-md" 
                src = {playlist?.images?.[0].url}
                alt=""/>
                <div>
                    <p className="mb-5 text-sm">PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-[75px] font-bold mb-8 ">
                        {playlist?.name} 
                    </h1>
                </div>
                </div>  
                <div className="grid grid-cols-2 content-end text-[#938888]  font-medium
                      px-5  mt-[30px] ">
                    
                    <div className="flex items-center space-x-4  md:w-[300px] w-[240px] ">
                        <p>#</p>
                        <p>Title</p>
                    </div>
                    <div  className="flex items-center justify-between ml-[180px]  ">
                        <div className="w-40 hidden md:inline">Album</div>
                        <ClockIcon className="w-5"/>
                    </div>
                </div>
                <hr className=" border-t-[0.3px] border-[#393535] hidden sm:block mt-2 pb-3" />
            </section>
            
            
            <div>
                <Songs/>
            </div>
        </div>
    );
}

