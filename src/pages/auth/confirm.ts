import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { createClient } from "@/lib/supabase";

// Tu prowadzi link z maila: /auth/confirm?token_hash=...&type=email (szablon supabase/templates/magic_link.html).
const ConfirmSchema = z.object({
  token_hash: z.string().min(1),
  type: z.literal("email"),
});

function backToSignIn(context: Parameters<APIRoute>[0], message: string) {
  return context.redirect(`/auth/signin?error=${encodeURIComponent(message)}`);
}

export const GET: APIRoute = async (context) => {
  const parsed = ConfirmSchema.safeParse({
    token_hash: context.url.searchParams.get("token_hash"),
    type: context.url.searchParams.get("type"),
  });
  if (!parsed.success) {
    return backToSignIn(context, "Ten link jest niepełny. Poproś o nowy.");
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return backToSignIn(context, "Logowanie jest chwilowo niedostępne.");
  }

  // verifyOtp zużywa jednorazowy kod i zapisuje sesję w cookies (przez setAll w src/lib/supabase.ts).
  const { error } = await supabase.auth.verifyOtp({
    token_hash: parsed.data.token_hash,
    type: parsed.data.type,
  });
  if (error) {
    return backToSignIn(context, "Link wygasł albo został już użyty. Poproś o nowy.");
  }

  return context.redirect("/");
};
