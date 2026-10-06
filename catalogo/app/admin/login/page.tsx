"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-center font-[family-name:var(--font-dancing-script)] text-3xl text-[#AC1214]">
        Painel Filinto
      </h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="Senha"
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#AC1214] px-3 py-2 font-medium text-white disabled:opacity-60"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
