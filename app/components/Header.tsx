"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoPower } from "react-icons/io5";

const Header = () => {
  const supabase = createClient();
  const router = useRouter();
  const [currentUser, setcurrentUser] = useState("");

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
      <div className="flex justify-between items-center p-2 max-w-screen-xl mx-auto">
        <a href="/" className="font-extrabold">
          融合キャラジェネレーター
        </a>
        {currentUser ? (
          <div className="flex items-center gap-2">
            {currentUser}
            <button className="btn btn-sm btn-ghost" onClick={doLogout}>
              <IoPower />
              ログアウト
            </button>
          </div>
        ) : (
          <a href="/login" className="btn btn-sm btn-ghost">
            ログイン
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
