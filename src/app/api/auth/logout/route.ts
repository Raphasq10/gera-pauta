import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true, message: "Sessão encerrada com sucesso." });
  } catch (err: any) {
    console.error("[AUTH_LOGOUT_ERROR]:", err?.message || err);
    return NextResponse.json({ error: "Erro ao encerrar sessão." }, { status: 500 });
  }
}
