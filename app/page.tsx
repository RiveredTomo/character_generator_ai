"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="my-8 mx-auto px-5 flex items-center flex-col gap-10 max-w-screen-xl">
        <h1 className="text-2xl md:text-5xl font-extrabold">
          融合キャラジェネレーター
        </h1>
        <p className="md:text-xl text-center">
          「何か」と「何か」を融合させて、キャラクターを作ろう！
        </p>
        <a href="/login" className="btn btn-lg btn-primary w-full md:w-auto">
          ログインページ
        </a>
      </div>
      <Footer />
    </main>
  );
}
