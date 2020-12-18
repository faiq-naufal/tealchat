import App from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "fontsource-inter/400-normal.css";
import "fontsource-inter/600-normal.css";
import "fontsource-inter/700-normal.css";
import { AuthProvider } from "../hooks/useAuth";
import Cookies from "cookies";
import absoluteUrl from "next-absolute-url";
import NProgress from "nprogress";
import Theme from "../components/Theme";
import "../utils/css/nprogress.css";

const setDocHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

export default function CustomApp({ Component, pageProps, userData = null }) {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    let routeChangeStart = () => NProgress.start();
    let routeChangeComplete = () => NProgress.done();

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);
    router.events.on("routeChangeError", routeChangeComplete);

    window.addEventListener("resize", setDocHeight, true);
    window.addEventListener("orientationchange", setDocHeight, true);
    setDocHeight();

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeComplete);
      router.events.off("routeChangeError", routeChangeComplete);

      window.removeEventListener("resize", setDocHeight, true);
      window.removeEventListener("orientationchange", setDocHeight, true);
    };
  }, []);

  return (
    <Theme>
      <AuthProvider user={userData}>
        <Component {...pageProps} />
      </AuthProvider>
    </Theme>
  );
}

export const redirectAuth = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  }
};

CustomApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;
  const { req, res, pathname } = ctx;

  if (req) {
    const cookies = new Cookies(req, res);
    const token = cookies.get("token");

    const isProtectedRoute =
      pathname !== "/accounts/signin" && pathname !== "/accounts/signup";
    const isForbiddenRoute = pathname === "/";

    if (!token) {
      if (isProtectedRoute || isForbiddenRoute) {
        redirectAuth(ctx, "/accounts/signin");
      }
    } else {
      try {
        const headers = {
          "Context-Type": "application/json",
          Authorization: JSON.stringify({ token: token }),
        };

        const { origin } = absoluteUrl(req);

        const user = await fetch(`${origin}/api/auth`, {
          headers,
        })
          .then((res) => res.json())
          .catch((error) => {
            console.log(error);
            redirectAuth(ctx, "/accounts/signin");
          });

        if (user.userData) {
          if (
            (user.userData && !isProtectedRoute) ||
            (user.userData && isForbiddenRoute)
          ) {
            redirectAuth(ctx, "/chat");
          }

          return { ...user, ...appProps };
        }
      } catch (error) {
        console.log(error);
        cookies.set("token", "", { expires: new Date() });
        redirectAuth(ctx, "/accounts/signin");
      }
    }
  }
  return { ...appProps };
};
