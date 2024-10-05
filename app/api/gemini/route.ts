import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const ApiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(ApiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 2,
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          nullable: false,
        },
        characteristic: {
          type: SchemaType.STRING,
          nullable: false,
        },
        imagePrompt: {
          type: SchemaType.STRING,
          nullable: false,
        },
      },
      required: ["name", "characteristic", "imagePrompt"], // 必須フィールドを追加
    },
  },
});

export async function POST(req: Request) {
  const reqBody = await req.json();
  const { material_1, material_2 } = reqBody;

  const prompt =
    `
    あなたは、架空のキャラクターを考えるのが得意です。
    2つの要素が融合した、ユーモアのあるキャラクターを考えてください。
    考えたキャラクターの名前と特徴、キャラクターのイメージを画像生成AI（Stable Diffusion）で表現するためのプロンプトを出力してください。
    名前と特徴は日本語、プロンプトは英語で出力してください。
    2つの要素は以下です。\n- 
    ` +
    material_1 +
    "\n- " +
    material_2;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({
      text,
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
