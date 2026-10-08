import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { CalendarDaysIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">

      {/* Navbar / Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform">
                <CalendarDaysIcon className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Planning App</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end">
            {user ? (
              <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Naar Dashboard <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 lg:px-8 relative overflow-hidden">
        {/* Subtiel achtergrond effect */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-2xl text-center z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 dark:text-zinc-400 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-white/10 dark:hover:ring-white/20 transition-all cursor-default bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              Versie 1.0 is nu live. <span className="font-semibold text-blue-600 dark:text-blue-400">Bekijk de features &darr;</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
            Gestroomlijnde planning voor jouw team
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-zinc-300 mb-10 max-w-xl mx-auto">
            Beheer taken, stel prioriteiten, en monitor uren in één overzichtelijke omgeving. Speciaal gebouwd voor naadloze samenwerking en overzicht.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105 active:scale-95"
              >
                Ga naar Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105 active:scale-95"
              >
                Inloggen om te beginnen
              </Link>
            )}
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Meer ontdekken <span aria-hidden="true">↓</span>
            </a>
          </div>

          {!user && (
            <div className="mt-12 mx-auto max-w-sm p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Probeer de Demo
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-zinc-400">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/80 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-700">
                  <span className="font-medium">E-mail:</span>
                  <code className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wide">demo@fakeaccount.nl</code>
                </div>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/80 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-700">
                  <span className="font-medium">Wachtwoord:</span>
                  <code className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wide">QAZ123</code>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Features sectie */}
      <div id="features" className="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400 uppercase tracking-wider">Alles onder controle</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              De perfecte flow voor jouw projecten
            </p>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-zinc-800">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-2 ring-1 ring-blue-100 dark:ring-blue-800 mb-4">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                  Overzichtelijke Planning
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-zinc-400">
                  <p className="flex-auto">Maak taken aan, stel statussen in en houd de deadlines haarscherp in de gaten met een minimalistische interface zonder afleidingen.</p>
                </dd>
              </div>
              <div className="flex flex-col items-start bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-zinc-800">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-2 ring-1 ring-blue-100 dark:ring-blue-800 mb-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                  Realtime Dashboard
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-zinc-400">
                  <p className="flex-auto">Direct inzicht in hoeveel uur werk er nog open staat, en welke prioriteiten vandaag jouw aandacht nodig hebben.</p>
                </dd>
              </div>
              <div className="flex flex-col items-start bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-zinc-800">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-2 ring-1 ring-blue-100 dark:ring-blue-800 mb-4">
                  <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                  Samenwerking (Binnenkort)
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-zinc-400">
                  <p className="flex-auto">Deel de werklast. Door meerdere gebruikers toe te wijzen, werk je efficiënter samen aan projecten met je hele team.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer / Credits */}
      <footer className="mt-auto py-8 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Ontwikkeld door <a href="https://edwinschipper.nl/" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Edwin Schipper</a>.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/EdwinSchipper/planning_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-2 transition-colors group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Bekijk project op GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}