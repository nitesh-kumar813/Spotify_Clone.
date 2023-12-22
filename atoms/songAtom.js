import {atom} from "recoil";

export const currentTrackIdState = atom({
    // unique ID (with respect to other atoms/selectors)
    key : "currentTrackIdState", 
    default: null,

});

export const isPlayingState = atom({
    key: "isPlayingState",
    default:false,
});