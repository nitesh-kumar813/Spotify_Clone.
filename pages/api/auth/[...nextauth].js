import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import SpotifyApi, { LOGIN_URL } from "/lib/spotify";
import { getToken } from "next-auth/jwt";
import { getProviders } from "next-auth/react";

async function refreshAccessToken(token){
    try{
        SpotifyApi.setAccessToken(token.accessToken);
        SpotifyApi.setRefreshToken(token.refreshToken);


        const {body: refreshedToken} = await SpotifyApi.refreshAccessToken();
        // console.log("REFRESHED TOKEN IS",refreshedToken);

        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //1h as 3600 comes from spotify api
            refreshedToken: refreshedToken.refresh_token ?? token.refreshToken, //if refresh token is not returned, use the old one
            
        }

    }catch (error){
        console.error(error);

        return {
            ...token,
            error:"RefreshAccessTokenError"
        };
    }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
      
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
      signIn:'/login',
  },
  callbacks:{
      async jwt({token,account,user}){
        //initial sign in 
        if (account && user){
            return{
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at *1000 // handling expiry in ms   
            }
        }

        //return prev token if access token has not expiret yet
        if (Date.now() < token.accessTokenExpires){
            console.log("EXISTING TOKEN IS OK")
            return token;
        }//still valid

        //AC expired, refresh token
        console.log("AC has expired, refresh")
        return await refreshAccessToken(token)

      },

      async session({session,token}){
        session.user.accessToken = token.accessToken; //part that the user can see
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session; 
      },
      
      async signOut({ url, baseUrl }) {
        // Redirect to login page after sign out
        return `${baseUrl}/login`;
      },
  },
});