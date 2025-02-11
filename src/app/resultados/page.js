"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  PieChart, Pie, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  BarChart, Bar, Legend, ResponsiveContainer 
} from "recharts";

export default function Resultados() {
  const [sessionData, setSessionData] = useState([]);

  useEffect(() => {
    fetch("/api/resultados")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setSessionData(data))
      .catch((err) => console.error("Error al obtener resultados:", err));
  }, []);

  // 🔹 Datos para gráficos
  const correctas = sessionData.filter((res) => res.resultado).length;
  const incorrectas = sessionData.length - correctas;

  const precisionData = [
    { name: "Correctas", value: correctas },
    { name: "Incorrectas", value: incorrectas },
  ];

  const ayudaData = [
    { name: "Usó Audio", value: sessionData.filter((res) => res.audio).length },
    { name: "Usó Pinyin", value: sessionData.filter((res) => res.pinyin).length },
    { name: "Sin Ayuda", value: sessionData.filter((res) => !res.audio && !res.pinyin).length },
  ];

  const sesionesUnicas = [...new Set(sessionData.map((res) => res.sesionId))];
  const progresoPorSesion = sesionesUnicas.map((sesion) => ({
    session: sesion,
    accuracy: (sessionData.filter((res) => res.sesionId === sesion && res.resultado).length /
               sessionData.filter((res) => res.sesionId === sesion).length) * 100,
  }));

  const erroresPorPalabra = sessionData
    .filter((res) => !res.resultado)
    .reduce((acc, res) => {
      acc[res.palabraId] = (acc[res.palabraId] || 0) + 1;
      return acc;
    }, {});

  const palabrasDificiles = Object.entries(erroresPorPalabra)
    .map(([word, errors]) => ({ word, errors }))
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 5); // 🛠️ Muestra las 5 palabras más difíciles

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Resumen de Resultados</h1>

      {/* 🔹 Gráficos en Grid */}
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 📌 Precisión General */}
        <Card className="shadow-md p-4">
          <h3 className="text-lg font-semibold text-center mb-4">Precisión General</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={precisionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#82ca9d" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 📌 Uso de Ayuda */}
        <Card className="shadow-md p-4">
          <h3 className="text-lg font-semibold text-center mb-4">Uso de Ayuda</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ayudaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#ffcc00" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 📌 Progreso por Sesión */}
        <Card className="shadow-md p-4">
          <h3 className="text-lg font-semibold text-center mb-4">Progreso por Sesión</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progresoPorSesion}>
                <XAxis dataKey="session" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 📌 Palabras Más Difíciles */}
        <Card className="shadow-md p-4">
          <h3 className="text-lg font-semibold text-center mb-4">Palabras Más Difíciles</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={palabrasDificiles}>
                <XAxis dataKey="word" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="errors" fill="#e63946" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 🔹 Tabla de Resultados */}
      <Card className="mt-6 shadow-md">
        <CardContent>
          <h3 className="text-lg font-semibold text-center mb-4">📜 Historial de Respuestas</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sesión</TableHead>
                  <TableHead>Palabra</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Audio</TableHead>
                  <TableHead>Pinyin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionData.map((res, index) => (
                  <TableRow key={index} className={res.resultado ? "bg-green-100" : "bg-red-100"}>
                    <TableCell>{res.sesionId}</TableCell>
                    <TableCell>{res.palabraId}</TableCell>
                    <TableCell>{res.resultado ? "✅ Correcto" : "❌ Incorrecto"}</TableCell>
                    <TableCell>{res.audio ? "🔊 Sí" : "❌ No"}</TableCell>
                    <TableCell>{res.pinyin ? "👀 Sí" : "❌ No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
