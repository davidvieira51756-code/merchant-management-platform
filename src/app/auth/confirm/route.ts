import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const destination = new URL("/auth/confirm/error", request.url);

  if (tokenHash && type === "email") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });

    if (!error && data.session) {
      destination.pathname = "/dashboard";
    }
  }

  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
