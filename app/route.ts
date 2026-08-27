import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Serve o site principal (arquivo estático, o mesmo de sempre) diretamente
// na raiz do domínio. O blog vive em /blog, dentro do mesmo projeto/deploy —
// assim os dois ficam no mesmo domínio, com o mesmo repositório.
export async function GET() {
  const filePath = path.join(process.cwd(), "public", "site.html");
  const html = await readFile(filePath, "utf8");
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
