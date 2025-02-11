import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";


// Función para eliminar acentos del pinyin
const removeAccents = (pinyin) => {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();
};

export async function GET() {
  try {
    const words = await prisma.word.findMany();

    if (!words || words.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const formattedWords = words.map(word => ({
      id: word.id,
      hanzi: word.hanzi,
      fullPinyin: word.pinyin,
      meaning: word.meaning.split(",").map(m => m.trim().toLowerCase()), 
      audioUrl: `/audio/${removeAccents(word.pinyin)}.mp3`
    }));

    return NextResponse.json(formattedWords);
  } catch (error) {
    console.error("🔥 Error en la API /api/words:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

