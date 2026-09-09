import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

export async function updateSession(request: NextRequest) {
  const responseHeaders = new Headers();
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // The SDK may supply cache headers only on the first cookie write.
          Object.entries(headers).forEach(([name, value]) => {
            responseHeaders.set(name, value);
          });
          const previousCookies = supabaseResponse.cookies.getAll();

          supabaseResponse = NextResponse.next({
            request,
            headers: responseHeaders,
          });

          previousCookies.forEach((cookie) => {
            supabaseResponse.cookies.set(cookie);
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getClaims();

  return supabaseResponse;
}
