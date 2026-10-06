import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Dit roept onze poortwachter functie aan die we zojuist in utils/ hebben gemaakt
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Dit bepaalt op welke pagina's de middleware (poortwachter) actief is.
     * Het is actief op ALLE pagina's BEHALVE:
     * - _next/static (static bestanden van Next.js)
     * - _next/image (afbeeldingen in Next.js)
     * - favicon.ico (het logo in het tabblad)
     * - Bestanden die eindigen op .svg, .png, .jpg, enz.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
