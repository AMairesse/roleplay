"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Image
              src={`/logo-dark.png`}
              width="120"
              height="120"
              className="block dark:hidden"
            />
            <Image
              src={`/logo-light.png`}
              width="120"
              height="120"
              className="hidden dark:block"
            />
            <Link href="/login">
              <button className="mt-2 block w-full rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white dark:bg-zinc-700 dark:text-zinc-100">
                Connectez-vous
              </button>
            </Link>
            <Link href="/worlds">
              <button className="mt-2 block w-full rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white dark:bg-zinc-700 dark:text-zinc-100">
                Accéder à un monde
              </button>
            </Link>
            <Link href="/register">
              <button className="mt-2 block w-full rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white dark:bg-zinc-700 dark:text-zinc-100">
                S'enregistrer
              </button>
            </Link>
          </div>
          <div className="mt-10"></div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.surferseo.art/3077e78a-4198-44f0-8126-7518a6cdae14.png"
          alt=""
        />
      </div>
    </div>
  );
}
