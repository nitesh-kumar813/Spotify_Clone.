import { getProviders, signIn } from "next-auth/react";

function Login({providers}) {
  return (
    <div className="relative bg-cover bg-center h-screen"
      style={{ backgroundImage: 'url("https://store-images.s-microsoft.com/image/apps.62597.13590394569790927.340ec820-3161-4168-93d3-b2a66a3c9b9c.229d58c9-0e76-4c86-af32-146cc01e6a7c?mode=scale&q=90&h=1080&w=1920")' }}>
    <div className="absolute inset-0 bg-gray-200 bg-opacity-20"></div>

    <div className="absolute top-5 left-5 p-2 md:left-10 h-[74px]  w-[200px] md:w-[200px] lg:w-[200px] xl:w-[220px] bg-[#201d1d] rounded-[20px]">
      <img src="https://zeevector.com/wp-content/uploads/Spotify-Black-and-White-Logo.png" alt="" />
    </div>

    <div className="flex items-center justify-center flex-col h-screen">
      <p className="text-white text-4xl font-black z-[100] text-center md:text-left">
        Grooves. Emotions. Vibes. Discover it all on Spotify.
      </p>

      {Object.values(providers).map((provider) => (
        <div key={provider.id} className="text-white text-[25px] font-semibold my-7">
          <button className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[240px] lg:w-[240px] xl:w-[240px] h-[75px] md:text-[25px] lg:text-[25px] xl:text-[25px] bg-[#42b742] rounded-[30px] border-2 border-[#92cb74] hover:bg-[#38de38]"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  </div>

  );
}
export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}



