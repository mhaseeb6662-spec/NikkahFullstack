"use client";

/**
 * Compat shims so existing react-router-dom style code (Link to=, NavLink,
 * useNavigate, useLocation, useSearchParams) keeps working unchanged on
 * Next.js App Router. Import these instead of "react-router-dom".
 */

import NextLink from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

// <Link to="/x"> -> forwards to Next's <Link href="/x">
export function Link({ to, href, children, ...rest }) {
  return (
    <NextLink href={href ?? to} {...rest}>
      {children}
    </NextLink>
  );
}

// <NavLink to="/x" end className={({isActive}) => ...}>
export function NavLink({ to, end, className, children, ...rest }) {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const cls = typeof className === "function" ? className({ isActive }) : className;
  return (
    <NextLink href={to} className={cls} {...rest}>
      {children}
    </NextLink>
  );
}

// const navigate = useNavigate(); navigate("/x")
export function useNavigate() {
  const router = useRouter();
  return (path) => router.push(path);
}

// const location = useLocation(); location.pathname
export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

// const [searchParams] = useSearchParams(); searchParams.get("x")
export function useSearchParams() {
  const sp = useNextSearchParams();
  return [sp];
}
