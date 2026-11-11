import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { createClient } from "@/lib/supabase";

// Wywoływany przyciskiem ze strony /auth/confirm. Dopiero tutaj jednorazowy kod jest zużywany (decyzja D16).
const ConfirmSchema = z.object({
  token_hash: z.string().min(1),
  type: z.literal("email"),
});

function backToSignIn(context: Parameters<APIRoute>[0], message: string) {
  return context.redirect(`/auth/signin?error=${encodeURIComponent(message)}`);
}

export const POST: APIRoute = async (context) => {
  const form = await context.request.formData();
  const parsed = ConfirmSchema.safeParse({
    token_hash: form.get("token_hash"),
    type: form.get("type"),
  });
  if (!parsed.success) {
    return backToSignIn(context, "Ten link jest niepełny. Poproś o nowy.");
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return backToSignIn(context, "Logowanie jest chwilowo niedostępne.");
  }

  // verifyOtp zużywa kod i zapisuje sesję w cookies (przez setAll w src/lib/supabase.ts).
  const { error } = await supabase.auth.verifyOtp({
    token_hash: parsed.data.token_hash,
    type: parsed.data.type,
  });
  if (error) {
    return backToSignIn(context, "Link wygasł albo został już użyty. Poproś o nowy.");
  }

  return context.redirect("/");
};
