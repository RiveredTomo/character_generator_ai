"use client";

import CharaInfo from "./components/CharaInfo";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Home() {
  const [material_1, setMaterial_1] = useState("");
  const [material_2, setMaterial_2] = useState("");
  const [charaName, setCharaName] = useState("");
  const [characteristic, setCharacteristic] = useState("");
  const [imagePass, setImagePass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setImagePass(fireworksData.filePass);
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
      <header className="sticky top-0 z-10 bg-primary text-white w-full">
        <div className="p-2 max-w-screen-xl mx-auto">
          <button className="text-2xl"></button>
        </div>
      </header>
      <div className="my-8 mx-auto px-5 flex items-center flex-col gap-10 max-w-screen-xl">
        <h1 className="text-2xl md:text-5xl font-extrabold">
          融合キャラジェネレーター
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
        <button
          onClick={onClickHandler}
          className="btn btn-lg btn-primary w-full md:w-auto"
          disabled={
            material_1 === "" || material_2 === "" || isLoading !== false
          }
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "融合させる"
          )}
        </button>
        <div className="w-full" hidden={!isLoading && !charaName}>
          <CharaInfo
            charaName={charaName}
            characteristic={characteristic}
            imagePass={imagePass}
          />
        </div>
      </div>
      <footer className="text-center text-slate-400 pb-2">
        <small>&copy; Rivered 2024</small>
      </footer>
    </main>
  );
}
