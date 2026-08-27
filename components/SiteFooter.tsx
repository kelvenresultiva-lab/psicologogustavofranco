import { SITE_NAME } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-deep py-8 text-center text-sm text-cream/70">
      © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
    </footer>
  );
}
