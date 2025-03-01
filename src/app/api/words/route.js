import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Function to remove accents and normalize pinyin
const removeAccents = (pinyin) => {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();
};

// Fetch words considering learning progress
export async function GET() {
  try {
    const words = await prisma.word.findMany({
      include: {
        results: {
          select: {
            is_correct: true,
            consecutive_correct: true,
          },
          orderBy: {
            date: "desc", // Get the most recent results first
          },
          take: 5, // Consider last 5 results to determine learning status
        },
      },
    });
    if (!words || words.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const formattedWords = words
      .map(word => {
        const lastResults = word.results || [];
        const learned = lastResults.length >= 5 && lastResults.every(res => res.is_correct);

        return {
          id: word.id,
          hanzi: word.hanzi,
          full_pinyin: word.pinyin,
          meaning: word.meaning.split(",").map(m => m.trim().toLowerCase()),
          all_meanings: word.meaning,
          category: word.category,
          difficulty: word.difficulty,
          learned, // New flag indicating if the word is considered learned
          audio_url: `/audio/${removeAccents(word.pinyin)}.mp3`
        };
      })
      .filter(word => !word.learned); // Remove learned words from the final dataset

    return NextResponse.json(formattedWords);
  } catch (error) {
    console.error("🔥 Error in /api/words:" + error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 200 });
  }
}
