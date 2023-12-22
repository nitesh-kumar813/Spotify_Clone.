import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function middleware(req){
    //We will have token if user is logged in
    const token = await getToken({req,secret:process.env.JWT_SECRET});

    const {pathname} = req.nextUrl

    //Allow the request if this is true
    // if its a request for next auth session & provider fetching OR token exists
    if (pathname.includes('/api/auth') || token){
        console.log("signing in");
        return NextResponse.next();
    }//let them in

    //redirect them to login if they dont have token AND a requesting a protected route
    if (pathname !== '/login' && !token){
        console.log("redirecting to login");
        return NextResponse.redirect(new URL('/login', req.url));
    }
}