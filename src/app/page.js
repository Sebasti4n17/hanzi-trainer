"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import levenshtein from "fast-levenshtein";

export default function Home() {
  const [sessionId, setSessionId] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showPinyin, setShowPinyin] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [audioUsed, setAudioUsed] = useState(false);

  const generateSessionId = (words) => {
    if (!words.length || !words[0]?.fullPinyin) {
        console.log("⚠️ No se encontró pinyin, generando ID genérico");
        return `session-${Date.now()}`;
    }
    const firstPinyin = words[0].fullPinyin
    ?.replace(/\s+/g, "") // Elimina solo espacios
        ?.toLowerCase() || "default"; 
    const uniqueNumber = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
    return `${firstPinyin}-${uniqueNumber}`;
};



  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = () => {
    fetch("/api/words")
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                const shuffledWords = data.sort(() => Math.random() - 0.5);
                setWords(shuffledWords);
                setCurrentWordIndex(0);
                setSessionId(generateSessionId(shuffledWords)); // Generar y almacenar el nuevo ID de sesión
            }
        })
        .catch((err) => console.error("Error al obtener palabras:", err));
};

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\(.*?\)/g, "") // Eliminar lo que está entre paréntesis
      .replace(/[¡!¿?]/g, "") // Eliminar signos de exclamación e interrogación
      .trim()
      .toLowerCase();
  };

  const checkAnswer = () => {
    const userAnswer = normalizeText(input);
    const currentWord = words[currentWordIndex];
  
    const correctAnswers = Array.isArray(currentWord?.meaning)
      ? currentWord.meaning.map(normalizeText)
      : [normalizeText(currentWord?.meaning)];
  
    const isMatch = correctAnswers.some(correct => levenshtein.get(userAnswer, correct) <= 1);
  
    if (isMatch) {
      setFeedback("✅ Correcto!");
      setCorrectCount(correctCount + 1);
      setShowCorrectAnswer(true);
      setIsCorrect(true);
      setCorrectWords([...correctWords, currentWord.hanzi]);
    } else {
      setFeedback("❌ Incorrecto.");
      setIncorrectCount(incorrectCount + 1);
      setShowCorrectAnswer(true);
      setIsCorrect(false);
      setIncorrectWords([...incorrectWords, currentWord.hanzi]);
    }
  
    // 🔊 Reproducir audio al responder
    const cleanHanzi = currentWord.hanzi.replace(/[\s！？]/g, "").trim();
    const audioFile = `/audio/${cleanHanzi}.mp3`;
    const audio = new Audio(audioFile);
    audio.onerror = () => console.warn("Error al cargar el audio:", audioFile);
    audio.play();
  
    // 📌 Guardar el intento en la base de datos
    fetch("/api/resultados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sesionId: sessionId,
        palabraId: currentWord.id,
        resultado: isMatch,
        audio: audioUsed,  // Ahora sí registra si se usó el audio
        pinyin: showPinyin,  
      }),
    }).catch((err) => console.error("Error al guardar resultado:", err));
  
    // 🔄 Resetear estados
    setTimeout(() => {
      if (currentWordIndex + 1 < words.length) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        fetchWords();
      }
      setInput("");
      setFeedback(null);
      setShowPinyin(false);
      setShowCorrectAnswer(false);
      setIsCorrect(null);
      setAudioUsed(false); // 🔹 Resetear el estado de audio
    }, 1500);
  };
  
  const revealPinyin = () => {
    setShowPinyin(true);
  };

  const playAudio = () => {
    if (!words.length || !words[currentWordIndex].hanzi) {
      alert("No se encontró el archivo de audio.");
      return;
    }
  
    try {
      const cleanHanzi = words[currentWordIndex].hanzi.replace(/[\s！？]/g, "").trim();
      const audioFile = `/audio/${cleanHanzi}.mp3`;
      const audio = new Audio(audioFile);
      audio.onerror = () => console.warn("Error al cargar el audio:", audioFile);
      audio.play();
  
      // Registrar que el usuario usó el audio
      setAudioUsed(true);
  
    } catch (error) {
      console.error("Error al reproducir el audio:", error);
    }
  };
  
  return (
    <div className="flex flex-col items-center mt-10 space-y-6" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <h2 className="text-lg font-semibold bg-gray-100 px-4 py-2 rounded-lg shadow-md">
        ✅ Correctas: {correctCount} | ❌ Incorrectas: {incorrectCount} | 📖 Restantes: {words.length - currentWordIndex}
      </h2>
      {words.length > 0 ? (
        <>
          <Card className={`p-6 w-full max-w-md text-center shadow-lg rounded-lg border ${isCorrect === true ? "bg-green-100 border-green-300" : isCorrect === false ? "bg-red-100 border-red-300" : "bg-blue-50 border-blue-200"}`}>
            <CardContent>
              <h1 className="text-4xl font-bold mb-2 text-blue-600">{words[currentWordIndex].hanzi}</h1>
              {showPinyin && <p className="text-lg text-gray-600 font-semibold">{words[currentWordIndex].fullPinyin}</p>}
              <div className="flex justify-center space-x-4 mt-4">
                <Button className="bg-blue-500 text-white hover:bg-blue-700" onClick={playAudio}>🔊 Escuchar</Button>
                <Button className="bg-gray-500 text-white hover:bg-gray-700" onClick={revealPinyin}>👀 Pinyin</Button>
              </div>
              <Input
                className={`mt-4 p-2 border rounded-md w-full shadow-sm ${isCorrect === true ? "border-green-500" : isCorrect === false ? "border-red-500" : ""}`}
                type="text"
                placeholder="Escribe el significado"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    checkAnswer();
                  }
                }}
              />

              <Button className="mt-4 w-full bg-green-500 text-white hover:bg-green-700" onClick={checkAnswer}>Verificar</Button>
              {showCorrectAnswer && (
                <p className={`mt-2 text-lg font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>🔹 Pinyin: {words[currentWordIndex].fullPinyin} | 🔹 Significado: {words[currentWordIndex].meaning}</p>
              )}
            </CardContent>
          </Card>
          <Card className="p-4 w-full max-w-md mt-6 shadow-lg rounded-lg border bg-gray-50">
            <CardContent>
              <h3 className="text-lg font-semibold text-center">📜 Respuestas</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Columna de respuestas correctas */}
                <div>
                  <h4 className="text-lg font-semibold text-green-600 text-center">✅ Correctas</h4>
                  <div className="flex flex-col items-center space-y-1 mt-2">
                    {correctWords.length > 0 ? (
                      correctWords.slice().reverse().map((word, index) => (
                        <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-md text-sm text-center">
                          {`${word}/${words.find(w => w.hanzi === word)?.fullPinyin || "?"}/${words.find(w => w.hanzi === word)?.meaning || "?"}`}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">Ninguna</p>
                    )}
                  </div>
                </div>

                {/* Columna de respuestas incorrectas */}
                <div>
                  <h4 className="text-lg font-semibold text-red-600 text-center">❌ Incorrectas</h4>
                  <div className="flex flex-col items-center space-y-1 mt-2">
                    {incorrectWords.length > 0 ? (
                      incorrectWords.slice().reverse().map((word, index) => (
                        <span key={index} className="px-3 py-1 bg-red-200 text-red-800 rounded-md text-sm text-center">
                          {`${word}/${words.find(w => w.hanzi === word)?.fullPinyin || "?"}/${words.find(w => w.hanzi === word)?.meaning || "?"}`}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">Ninguna</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-lg">Cargando palabras...</p>
      )}
    </div>
  );
}
