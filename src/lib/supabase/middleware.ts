import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { COOKIES_KEYS } from "@/lib/config/constants";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  await supabase.auth.getUser();

  if (request.nextUrl.pathname === "/") {
    const hasVisited = request.cookies.get(COOKIES_KEYS.HAS_VISITED);

    if (!hasVisited) {
      const url = request.nextUrl.clone();
      url.pathname = "/introduction";

      const redirectResponse = NextResponse.redirect(url);

      redirectResponse.cookies.set(COOKIES_KEYS.HAS_VISITED, "true", {
        maxAge: 60 * 60 * 24 * 365,
      }); // 1年有効
      // supabaseのcookieも引き継ぐ
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, {
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          path: cookie.path,
          sameSite: cookie.sameSite,
          secure: cookie.secure,
        });
      });

      return redirectResponse;
    }
  }

  return response;
}
