"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// ログインチェック処理
export async function checkLogin() {
  const supabase = createClient();

  // ユーザー情報取得
  const { data, error } = await supabase.auth.getUser();
  // ログインしていれば作成ページへリダイレクト
  if (data?.user) {
    redirect("/create");
  }
}

// ログイン処理
export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
  }

  revalidatePath("/", "layout");
  redirect("/create");
}

// サインアップ処理
export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/create");
}
