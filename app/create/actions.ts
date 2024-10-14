"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

// ユーザーチェック処理
export async function checkUser() {
  // 利用回数上限を環境変数から取得（未定義なら0）
  const maxCount = process.env.MAX_COUNT ?? 0;

  // ユーザー情報取得
  const { data, error } = await supabase.auth.getUser();
  // 未ログインならログインページへリダイレクト
  if (error || !data?.user) {
    redirect("/login");
  }
  const user_id = data?.user.id;
  // DBからカウント数を取得
  const { data: fetch_data } = await supabase
    .from("tbl_usages")
    .select("count")
    .eq("id", user_id);
  // レコードが無い場合は0
  const count = fetch_data && fetch_data.length !== 0 ? fetch_data[0].count : 0;

  const nowCount = Math.max(0, Number(maxCount) - count);

  return nowCount;
}

// カウントをインクリメント
export async function incrementCount() {
  // ユーザー情報取得
  const { data, error } = await supabase.auth.getUser();
  // 未ログインならfalse
  if (error || !data?.user) {
    return false;
  }
  const user_id = data?.user.id;

  // DBからカウント数を取得
  const { data: fetch_data } = await supabase
    .from("tbl_usages")
    .select("count")
    .eq("id", user_id);
  const count = fetch_data && fetch_data.length !== 0 ? fetch_data[0].count : 0;
  const newCount = count + 1;
  // 現在時刻を取得
  const currentTime = new Date();

  // countの値をUPSERT
  const { data: upsert_data, error: upsert_error } = await supabase
    .from("tbl_usages")
    .upsert(
      { id: user_id, count: newCount, updated_at: currentTime },
      { onConflict: "id" }
    );

  console.log(upsert_data);

  if (upsert_error) {
    return false;
  }

  return true;
}

// 情報をDBに保存
