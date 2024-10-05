import { NextResponse } from "next/server";
import fs from "fs";
import { v4 } from "uuid";

const ApiKey = process.env.FIREWORKS_API_KEY;

export async function POST(req: Request) {
  const reqBody = await req.json();
  const { imagePrompt } = reqBody;

  console.log(imagePrompt);

  try {
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "image/jpeg",
          Authorization: "Bearer " + ApiKey,
        },
        body: JSON.stringify({
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 15,
          seed: 0,
          safety_check: false,
          prompt: "masterpiece, best quality, " + imagePrompt,
          negative_prompt:
            "low quality,worst quality:1.4, missing fingers, bad hands, missing fingers, two shot",
        }),
      }
    );

    // To process the response and get the image:
    const buffer = await response.arrayBuffer();

    // ファイル名をuuidで生成
    const fileName = v4();
    const filePass = "/output/" + fileName + ".jpg";

    // ファイルを書き出し
    fs.writeFile("public" + filePass, Buffer.from(buffer), () =>
      console.log("finished downloading!")
    );

    // 画像表示用のファイルパスを返す
    return NextResponse.json({
      filePass: filePass,
    });
  } catch (error) {
    console.error("Error:", error); // エラーをログに記録
    return NextResponse.json(
      {
        message: "画像生成中にエラーが発生しました。",
        error: error instanceof Error ? error.message : String(error), // エラーメッセージを安全に取得
      },
      { status: 500 }
    ); // ステータスコード500を返す
  }
}
