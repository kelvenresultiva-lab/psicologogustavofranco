import { NextResponse } from "next/server";

// Rota temporária só para diagnosticar por que as env vars não estão
// chegando no servidor. Não expõe nenhum valor, só se existe/está vazio.
// REMOVER depois de resolver.
export async function GET() {
  function status(name: string) {
    const v = process.env[name];
    if (v === undefined) return "ausente";
    if (v === "") return "vazio";
    return `presente (${v.length} caracteres)`;
  }

  return NextResponse.json({
    ADMIN_EMAIL: status("ADMIN_EMAIL"),
    ADMIN_PASSWORD: status("ADMIN_PASSWORD"),
    SESSION_SECRET: status("SESSION_SECRET"),
    Gustavo_POSTGRES_PRISMA_URL: status("Gustavo_POSTGRES_PRISMA_URL"),
    VERCEL_ENV: process.env.VERCEL_ENV ?? "desconhecido",
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? "desconhecido",
  });
}
