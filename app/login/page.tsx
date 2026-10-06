import { Field, Label, Checkbox } from '@headlessui/react';
import TextField from '../ui/input';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welkom terug</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">Log in op je account om verder te gaan</p>
        </div>


        <form className="space-y-6">
          <TextField
            label="E-mailadres"
            name="email"
            type="email"
            required
            placeholder="naam@bedrijf.nl"
          />

          <TextField
            label="Wachtwoord"
            name="password"
            type="password"
            required
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <Field className="flex items-center gap-2">
              <Checkbox
                name="remember-me"
                className="group block h-4 w-4 rounded border border-gray-300 bg-white data-[checked]:bg-blue-600 data-[checked]:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 outline-none transition-all"
              >
                <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                  <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Checkbox>
              <Label className="block text-sm text-gray-700 dark:text-zinc-300 cursor-pointer">
                Onthoud mij
              </Label>
            </Field>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Wachtwoord vergeten?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:ring-4 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/30 outline-none"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}