"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function RevisarSesion() {
  const [sessionData, setSessionData] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const playAudio = (hanzi) => {
    const cleanHanzi = hanzi.replace(/[^\u4e00-\u9fff]/g, "").trim(); // Limpia caracteres no chinos
    const audioFile = `/audio/${cleanHanzi}.mp3`;
    const audio = new Audio(audioFile);
    audio.onerror = () => console.warn("Error al cargar el audio:", audioFile);
    audio.play();
  };

  useEffect(() => {
    fetch("/api/resultados")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSessionData(data);
      })
      .catch((err) => console.error("Error al obtener resultados:", err));
  }, []);

  // 🔹 Obtener las sesiones únicas con fecha de primer intento
  const sesionesUnicas = [...new Set(sessionData.map(res => res.session_id))]
    .map((session) => {
      const firstResult = sessionData.find(res => res.session_id === session);
      return {
        id: session,
        label: `${session} - ${new Date(firstResult?.date).toLocaleString()}`,
      };
    });

  // 🔄 Filtrar datos cuando cambia la sesión seleccionada
  useEffect(() => {
    if (selectedSession) {
      setFilteredData(sessionData.filter(res => res.session_id === selectedSession));
    } else {
      setFilteredData([]);
    }
  }, [selectedSession, sessionData]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📂 Revisar Sesión</h1>

      {/* 🔽 Selector de Sesión */}
      <Card className="shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-center mb-4">Selecciona una Sesión</h3>
        <Select onValueChange={(value) => setSelectedSession(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una sesión" />
          </SelectTrigger>
          <SelectContent>
            {sesionesUnicas.map((session) => (
              <SelectItem key={session.id} value={session.id}>
                {session.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* 📜 Tabla de Resultados */}
      {filteredData.length > 0 && (
        <Card className="mt-6 shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold text-center mb-4">📜 Historial de Respuestas</h3>
            <div className="overflow-x-auto">
              <Table className="mt-6">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-center">Hanzi</TableHead>
                    <TableHead className="text-center">Pinyin</TableHead>
                    <TableHead className="text-center">Significado</TableHead>
                    <TableHead className="text-center">Resultado</TableHead>
                    <TableHead className="text-center">Audio</TableHead>
                    <TableHead className="text-center">Pinyin</TableHead>
                    <TableHead className="text-center">Escuchar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((result, index) => (
                    <TableRow key={index}>
                      {/* 🔹 Hanzi */}
                      <TableCell className="text-center font-bold text-lg">{result.word.hanzi}</TableCell>

                      {/* 🔹 Pinyin */}
                      <TableCell className="text-center">{result.word.pinyin}</TableCell>

                      {/* 🔹 Significado */}
                      <TableCell className="text-center">{result.word.meaning}</TableCell>

                      {/* 🔹 Resultado */}
                      <TableCell className={`text-center font-semibold ${result.is_correct ? "text-green-600" : "text-red-600"}`}>
                        {result.is_correct ? "✅ Correcto" : "❌ Incorrecto"}
                      </TableCell>

                      {/* 🔹 Audio utilizado */}
                      <TableCell className="text-center">{result.used_audio ? "🔊 Sí" : "❌ No"}</TableCell>

                      {/* 🔹 Pinyin mostrado */}
                      <TableCell className="text-center">{result.used_pinyin ? "👀 Sí" : "❌ No"}</TableCell>

                      {/* 🔹 Escuchar audio */}
                      <TableCell className="text-center">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => playAudio(result.word.hanzi)}
                        >
                          🔊
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
