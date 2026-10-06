"use client";

// useActionState is a React Hook that lets you update state with side effects using Actions.
import { useActionState } from 'react';
import TextField from './input';
import UICheckbox from './checkbox';
import { login } from '../(auth)/login/actions';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-6 mt-6">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">{state.error}</p>
        </div>
      )}

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
        <UICheckbox name="remember-me" label="Onthoud mij" />
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Wachtwoord vergeten?
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:ring-4 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/30 outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? 'Bezig met inloggen...' : 'Inloggen'}
      </button>
    </form>
  );
}
