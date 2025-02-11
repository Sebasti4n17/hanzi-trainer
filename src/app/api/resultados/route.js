import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const resultados = await prisma.resultado.findMany({
      include: {
        palabra: true, // Incluye la relación con la palabra (Hanzi, Pinyin, etc.)
      },
    });

    return new Response(JSON.stringify(resultados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error obteniendo los resultados" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const { sesionId, palabraId, resultado, audio, pinyin } = await req.json();

    const nuevoResultado = await prisma.resultado.create({
      data: {
        sesionId,
        palabraId,
        resultado,
        audio,
        pinyin,
      },
    });

    return NextResponse.json(nuevoResultado, { status: 201 });
  } catch (error) {
    console.error("Error guardando resultado:", error);
    return NextResponse.json({ error: "Error al guardar el resultado" }, { status: 500 });
  }
}
