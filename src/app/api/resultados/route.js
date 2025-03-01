import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

// ✅ Método GET - Obtener todos los resultados
export async function GET() {
    try {
        const results = await prisma.result.findMany({
            include: {
                word: true, // 🔹 Incluye la relación con la tabla de palabras
            },
            orderBy: {
                date: "desc", // 🔹 Ordena los resultados por fecha descendente
            },
        });

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("🔥 Error fetching results:", error);
        return NextResponse.json({ error: "Error fetching results" }, { status: 500 });
    }
}

// ✅ Método POST - Guardar un nuevo resultado y actualizar el progreso de aprendizaje
export async function POST(req) {
  try {
     

      const textBody = await req.text();
     

      if (!textBody) {
          throw new Error("❌ El cuerpo del request está vacío.");
      }

      const body = JSON.parse(textBody);
   

      const { sessionId, word_id, is_correct, used_audio, used_pinyin, user_response } = body;

      if (!sessionId || !word_id) {
          throw new Error("❌ Faltan datos obligatorios en el request.");
      }

      // 🔹 Buscar la palabra en la base de datos
      const wordExists = await prisma.word.findFirst({
          where: { hanzi: word_id }
      });

      if (!wordExists) {
          throw new Error(`❌ Word not found: ${word_id}`);
      }

      // 🔹 Insertar resultado en la base de datos con valores directos
      const newResult = await prisma.result.create({
          data: {
              session_id: sessionId,
              word_id: wordExists.id,
              is_correct,
              used_audio: used_audio || false,
              used_pinyin: used_pinyin || false,
              user_response: user_response || null,
              error_count: is_correct ? 0 : 1,  // 🔹 Usa 0 o 1 en lugar de { increment: 1 }
              consecutive_correct: is_correct ? 1 : 0,  // 🔹 Usa 1 o 0 en lugar de { increment: 1 }
          },
      });

      return NextResponse.json(newResult, { status: 201 });

  } catch (error) {
      console.error("🔥 Error al guardar resultado:", error.message);
      return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
