"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps the app and conditionally hides the public Header/Footer
 * for portal routes (/guide/*, /admin/*) which provide their own chrome.
 *
 * Server-rendered <Header /> + <Footer /> are passed in as props so this
 * client component can decide whether to render them — keeping them as
 * server components instead of forcing the whole tree client-side.
 */
export function PublicChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const path = usePathname() ?? "/";
  const isPortal = path.startsWith("/guide") || path.startsWith("/admin");

  return (
    <>
      {!isPortal && header}
      <main className="relative">{children}</main>
      {!isPortal && footer}
    </>
  );
}
