"use client";

import { checkUser, incrementCount } from "./actions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CharaInfo from "@/components/CharaInfo";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function Create() {
  const [count, setCount] = useState<number | null>(null);
  const [material_1, setMaterial_1] = useState("");
  const [material_2, setMaterial_2] = useState("");
  const [charaName, setCharaName] = useState("");
  const [characteristic, setCharacteristic] = useState("");
  const [imagePass, setImagePass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ユーザーのチェック
  useEffect(() => {
    const fetchUserCount = async () => {
      const cnt = await checkUser();
      setCount(cnt);
    };

    fetchUserCount();
  }, [isLoading]);

  // Geminiでキャラクターの名前と特徴、画像生成用のプロンプトを生成
  const fetchGeminiData = async () => {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ material_1, material_2 }),
    });
    if (!response.ok) throw new Error("Error fetching Gemini data");
    return await response.json();
  };

  // Fireworks AIのStable Diffusionで画像を生成
  const fetchFireworksData = async (imagePrompt: string) => {
    const response = await fetch("/api/fireworks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagePrompt }),
    });
    if (!response.ok) throw new Error("Error fetching Fireworks data");
    return await response.json();
  };

  const onClickHandler = async () => {
    // 入力されていなければ終了
    if (!material_1 || !material_2) return;

    if (!count || count <= 0) {
      alert("本日の利用可能回数の上限に達しました。明日までお待ち下さい。");
      return;
    }

    // ローディングフラグをオン
    setIsLoading(true);
    // 空にする
    setCharaName("");
    setCharacteristic("");
    setImagePass("");
    try {
      const geminiData = await fetchGeminiData();
      const dataObj = JSON.parse(geminiData.text);
      //
      setCharaName(dataObj.name);
      setCharacteristic(dataObj.characteristic);

      // 画像生成用のプロンプトをStable Diffusion渡す
      const fireworksData = await fetchFireworksData(dataObj.imagePrompt);
      // 画像パスをセット
      setImagePass(fireworksData.filePass);
      if (!incrementCount()) alert("エラーが発生しました。");
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました。");
      setIsLoading(false);
    } finally {
      // 最後にローディングフラグをオフ
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="my-8 mx-auto px-5 flex items-center flex-col gap-10 max-w-screen-xl">
        <h1 className="text-2xl md:text-5xl font-extrabold">
          AIに融合キャラを作ってもらおう
        </h1>
        <p className="md:text-xl text-center">
          「何か」と「何か」を融合させて、キャラクターを作ろう！
          <br />
          下に融合させたいものをそれぞれ入力して、「融合させる」ボタンを押してね！
        </p>
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
          <input
            value={material_1}
            onChange={(e) => setMaterial_1(e.target.value)}
            type="text"
            className="input input-primary w-full text-center"
            name="material_1"
            placeholder="「何か」その1"
          />
          <span className="text-6xl">
            <IoClose />
          </span>
          <input
            value={material_2}
            onChange={(e) => setMaterial_2(e.target.value)}
            type="text"
            className="input input-primary w-full text-center"
            name="material_2"
            placeholder="「何か」その2"
          />
        </div>
        <div className="text-center">
          <button
            onClick={onClickHandler}
            className="btn btn-lg btn-primary w-full md:w-auto"
            disabled={
              material_1 === "" ||
              material_2 === "" ||
              isLoading !== false ||
              !count ||
              count <= 0
            }
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "融合させる"
            )}
          </button>
          <p className="mt-5">
            {count !== null
              ? "本日の残り回数：" + count + "回"
              : "残り回数を読み込み中…"}
          </p>
        </div>
        <div className="w-full" hidden={!isLoading && !charaName}>
          <CharaInfo
            charaName={charaName}
            characteristic={characteristic}
            imagePass={imagePass}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
