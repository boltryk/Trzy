import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { createClient } from "@/lib/supabase";

const SignInSchema = z.object({
  email: z.email(),
});

function backToSignIn(context: Parameters<APIRoute>[0], message: string) {
  return context.redirect(`/auth/signin?error=${encodeURIComponent(message)}`);
}

export const POST: APIRoute = async (context) => {
  const form = await context.request.formData();
  const parsed = SignInSchema.safeParse({ email: form.get("email") });
  if (!parsed.success) {
    return backToSignIn(context, "Podaj poprawny adres e-mail.");
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return backToSignIn(context, "Logowanie jest chwilowo niedostępne.");
  }

  // Magic link: Supabase wysyła mail z linkiem (szablon supabase/templates/magic_link.html).
  // shouldCreateUser: pierwsze logowanie zakłada konto, więc osobna rejestracja nie jest potrzebna.
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    // Tylko kod i status: bez message, e-maila i tokenu (reguła 6, observability w wrangler.jsonc).
    // eslint-disable-next-line no-console -- celowy log kodu błędu do wrangler tail
    console.warn("auth.signin.failed", { code: error.code ?? "unknown", status: error.status });
    return backToSignIn(context, "Nie udało się wysłać linku. Spróbuj ponownie za chwilę.");
  }

  // Adresu e-mail nie przekazujemy w URL-u, żeby nie trafiał do logów i historii przeglądarki.
  return context.redirect("/auth/check-email");
};
