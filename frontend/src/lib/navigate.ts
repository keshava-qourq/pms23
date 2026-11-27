import { useInRouterContext, useNavigate as useRouterNavigate } from "react-router-dom";

/**
 * `navigate(route)` in the preview posted a message to the host. Here it is
 * real routing, so the route slug the screen was written against has to
 * become the router path the scaffold mounted it at. This mirrors
 * `route_to_url_path` on the Python side; the two must agree or a link goes
 * nowhere.
 */
export function toPath(route: string): string {
  const trimmed = route.trim().replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "/";
  return (
    "/" +
    trimmed
      .split("/")
      .map((segment) =>
        segment.startsWith(":")
          ? segment
          : segment
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
      )
      .join("/")
  );
}

export function useNavigate(): (route: string) => void {
  // A screen can be unit-tested in isolation, with no <Router> mounted around
  // it at all -- calling react-router's useNavigate unconditionally then
  // throws ("useNavigate() may be used only in the context of a <Router>
  // component.") before the component renders anything. useInRouterContext
  // is stable for the lifetime of a given render tree (a screen is either
  // mounted under a Router or it isn't), so calling the router hook only
  // when it is safe to do so does not vary the hook order between renders.
  const inRouter = useInRouterContext();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = inRouter ? useRouterNavigate() : null;
  return (route: string) => {
    navigate?.(toPath(route));
  };
}
