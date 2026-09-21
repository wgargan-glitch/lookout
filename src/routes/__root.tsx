import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ServiceWorkerRegister } from "@/components/layout/service-worker";
import { SiteShell } from "@/components/layout/site-shell";
import { useT } from "@/lib/use-locale";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Lookout";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Lookout — peer-to-peer car rentals from locals at America's national parks.",
      },
      { name: "theme-color", content: "#2f4a38" },
      { property: "og:title", content: "Lookout — car rentals at America's national parks" },
      { property: "og:description", content: "A local car. At the trailhead." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://lookoutparks.com/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://lookoutparks.com/og.jpg" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/images/app/icon-192.png" },
      { rel: "apple-touch-icon", href: "/images/app/icon-180.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap",
      },
    ],
  }),
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <ServiceWorkerRegister />
        <AuthProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: "font-sans",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  const t = useT();
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{t("notFound.kicker")}</p>
      <h1 className="mt-2 font-display text-4xl">{t("notFound.title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("notFound.body")}</p>
      <a href="/" className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
        {t("notFound.back")}
      </a>
    </main>
  );
}
