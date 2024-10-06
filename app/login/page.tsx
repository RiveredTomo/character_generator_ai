"use client";

// import { createClient } from "@/utils/supabase/client";
import { login } from "./actions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  return (
    <main className="min-h-screen">
      <Header />
      <form className="my-8 mx-auto px-5 flex items-center flex-col gap-10 w-full max-w-screen-sm">
        <h1 className="text-2xl md:text-5xl font-extrabold">ログイン</h1>
        <label className="input input-primary flex items-center gap-2 w-full">
          Email
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="example@rivered.net"
            required
          />
        </label>
        <label className="input input-primary flex items-center gap-2 w-full">
          PassWord
          <input
            type="password"
            name="password"
            className="grow"
            placeholder="******"
            required
          />
        </label>

        <button
          formAction={login}
          className="btn btn-lg btn-primary w-full md:w-auto"
        >
          ログイン
        </button>
      </form>
      <Footer />
    </main>
  );
}
