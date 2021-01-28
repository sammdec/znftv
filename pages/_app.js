import { useEffect } from "react"
import { useRouter } from "next/router"
import * as Fathom from "fathom-client"
import { css } from "stitches.config"
import { QueryClient, QueryClientProvider } from "react-query"

css.global({
  body: {
    padding: 0,
    margin: 0,
    fontFamily: "@body",
    fontSize: "@1",
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
})

export default function App({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    Fathom.load("CUOXTDGQ", {
      excludedDomains: ["localhost"],
      url: "https://bee.nfte.app/script.js",
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
