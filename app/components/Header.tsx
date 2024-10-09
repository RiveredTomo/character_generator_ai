"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoPower, IoReorderThreeSharp, IoPerson } from "react-icons/io5";

const Header = () => {
  const supabase = createClient();
  const router = useRouter();
  const [currentUser, setcurrentUser] = useState<string | null>(null);

  // 現在ログインしているユーザーを取得する処理
  const getCurrentUser = async () => {
    // ログインのセッションを取得する処理
    const { data } = await supabase.auth.getSession();
    // セッションがあるときだけ現在ログインしているユーザーを取得する
    if (data.session !== null) {
      // supabaseに用意されている現在ログインしているユーザーを取得する関数
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // currentUserにユーザーのメールアドレスを格納
      setcurrentUser(user!.email!);
    } else {
      setcurrentUser("NoLogin");
    }
  };

  // ログアウトの処理を追加
  const doLogout = async () => {
    // supabaseに用意されているログアウトの関数
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    // ログアウトを反映させるためにリロードさせる
    router.push("/");
  };

  // HeaderコンポーネントがレンダリングされたときにgetCurrentUser関数が実行される
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <header className="sticky top-0 z-10 bg-primary text-white w-full">
      <div className="flex justify-between items-center p-2 max-w-screen-xl mx-auto h-14">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <a href="/" className="font-extrabold">
          融合キャラジェネレーター
        </a>
        {currentUser === null ? (
          <span className="btn btn-sm btn-ghost"></span>
        ) : currentUser === "NoLogin" ? (
          <a href="/login" className="btn btn-sm btn-ghost">
            ログイン
          </a>
        ) : (
          <div className="flex items-center gap-2">
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                className="drawer-button text-4xl cursor-pointer"
              >
                <IoReorderThreeSharp />
              </label>
            </div>
          </div>
        )}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="bg-primary flex flex-col justify-between gap-3 min-h-full w-80 p-4 [&>li]:flex [&>li]:justify-center [&>li]:items-center [&>li]:w-full [&>li>a]:text-xl">
            <li className="gap-2">
              <IoPerson />
              {currentUser}
            </li>
            <li>
              <a href="/create" className="btn btn-ghost w-full">
                融合キャラを作る
              </a>
            </li>
            <li className="flex-1"></li>
            <li>
              <button
                className="btn btn-ghost w-full text-xl"
                onClick={doLogout}
              >
                <IoPower />
                ログアウト
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
