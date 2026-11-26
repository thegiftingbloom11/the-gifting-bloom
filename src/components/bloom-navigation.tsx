import { forwardRef, useCallback, useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { bouquetBuilderEnabled } from "@/lib/bloom";
import {
  Link as RouterLink,
  useLocation,
  useNavigate as useRouterNavigate,
  useNavigationType,
} from "react-router";

type Destination = {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string | undefined> | true;
  hash?: string | true;
};

type ActiveOptions = { exact?: boolean; includeSearch?: boolean; includeHash?: boolean };
type LinkProps = Omit<ComponentPropsWithoutRef<typeof RouterLink>, "to"> &
  Destination & { activeOptions?: ActiveOptions };

function destinationUrl(
  { to, params, search, hash }: Destination,
  current: { search: string; hash: string },
) {
  const pathname = to.replace(/\$([\w]+)/g, (part, key: string) =>
    params?.[key] !== undefined ? encodeURIComponent(params[key]) : part,
  );
  const query = new URLSearchParams();
  if (search && search !== true) {
    for (const [key, value] of Object.entries(search)) {
      if (value !== undefined) query.set(key, value);
    }
  }
  return {
    pathname,
    search: search === true ? current.search : query.size ? "?" + query.toString() : "",
    hash: hash === true ? current.hash : hash ? "#" + hash : "",
  };
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, params, search, hash, activeOptions, ...props },
  ref,
) {
  const location = useLocation();
  const destination = destinationUrl(
    { to, ...(params && { params }), ...(search && { search }), ...(hash && { hash }) },
    location,
  );
  const pathnameMatches =
    location.pathname === destination.pathname ||
    (!activeOptions?.exact &&
      destination.pathname !== "/" &&
      location.pathname.startsWith(destination.pathname + "/"));
  const active =
    pathnameMatches &&
    (activeOptions?.includeSearch === false || location.search === destination.search) &&
    (!activeOptions?.includeHash || location.hash === destination.hash);
  return (
    <RouterLink {...props} ref={ref} to={destination} data-status={active ? "active" : undefined} />
  );
});

export function useNavigate() {
  const location = useLocation();
  const navigate = useRouterNavigate();
  return useCallback(
    ({
      replace,
      resetScroll,
      hashScrollIntoView,
      ...target
    }: Destination & {
      replace?: boolean;
      resetScroll?: boolean;
      hashScrollIntoView?: boolean;
    }) =>
      navigate(destinationUrl(target, location), {
        replace: replace ?? false,
        state: { preserveScroll: resetScroll === false || hashScrollIntoView === false },
      }),
    [location, navigate],
  );
}

export function RouteScroll() {
  const location = useLocation();
  const navigation = useNavigationType();
  const visited = useRef(new Map<string, number>());
  useEffect(() => {
    const onScroll = () => visited.current.set(location.key, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const frame = requestAnimationFrame(() => {
      if (location.state?.preserveScroll) return;
      const previous = visited.current.get(location.key);
      if (navigation === "POP" && previous !== undefined) {
        window.scrollTo(0, previous);
      } else if (location.hash) {
        const section = location.hash.slice(1);
        const target = section === "customise" && !bouquetBuilderEnabled ? "contact" : section;
        document.getElementById(target)?.scrollIntoView();
      } else if (location.key !== "default") {
        window.scrollTo(0, 0);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location, navigation]);
  return null;
}
