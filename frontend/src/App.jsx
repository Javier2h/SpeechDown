import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; 

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function App() {
    const [palabra, setPalabra] = useState('');
    const [ejercicio, setEjercicio] = useState('');
    const [audio, setAudio] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [children, setChildren] = useState([]);
    const [childId, setChildId] = useState('');
    const [sesiones, setSesiones] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/children')
            .then((res) => setChildren(res.data))
            .catch((err) => console.error('Error al obtener niños:', err));
    }, []);

    const generarEjercicio = async () => {
        if (!childId) {
            alert("Selecciona un niño antes de generar el ejercicio.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/ejercicio', { palabra });
            setEjercicio(response.data.ejercicio);
            setHistorial((prev) => [...prev, response.data.ejercicio]);

            await axios.post('http://localhost:3000/api/sessions', {
                palabra,
                ejercicio: response.data.ejercicio,
                childId: childId
            });

            const audioResponse = await axios.post(
                'http://localhost:3000/api/tts',
                { texto: response.data.ejercicio },
                { responseType: 'blob' }
            );
            setAudio(URL.createObjectURL(audioResponse.data));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const obtenerSesiones = async () => {
        if (!childId) return;
        try {
            const res = await axios.get(`http://localhost:3000/api/sessions/${childId}`);
            setSesiones(res.data);
        } catch (err) {
            console.error("Error al obtener sesiones:", err);
        }
    };

    const progreso = {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
            {
                label: 'Palabras practicadas',
                data: [5, 7, 10, 13],
                backgroundColor: '#c08ff0',
            },
        ],
    };

    const opciones = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Evolución del habla' },
        },
    };

    return (
        <div className="min-h-screen bg-[#18181b] flex flex-col items-center p-4">
            <h1 className="text-5xl font-bold text-[#a78bfa] mb-8 text-center"> Generador de Ejercicios de Habla</h1>

            <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full max-w-md px-4 py-2 mb-4 rounded-md bg-[#23232b] border border-[#27272a] text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
            >
                <option value="">Selecciona un niño</option>
                {children.map((child) => (
                    <option key={child.id} value={child.id}>
                        {child.nombre} (Edad: {child.edad})
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={palabra}
                onChange={(e) => setPalabra(e.target.value)}
                placeholder="Ingresa una palabra"
                className="w-full max-w-md px-4 py-2 mb-4 rounded-md bg-[#23232b] border border-[#27272a] text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
                aria-label="Palabra para generar ejercicio"
            />

            <button
                onClick={generarEjercicio}
                className="bg-green text-[#18181b] px-6 py-2 rounded-md mb-2"
            >
                Generar Actividad
            </button>

            <button
                onClick={obtenerSesiones}
                className="bg-purple text-[#18181b] px-6 py-2 rounded-md"
            >
                Ver sesiones guardadas
            </button>

            {ejercicio && (
                <div className="mt-6 w-full max-w-md">
                    <p className="text-lg font-semibold mb-2"> Ejercicio generado:</p>
                    <p className="bg-[#23232b] p-4 rounded text-[#f3f4f6]">{ejercicio}</p>
                </div>
            )}

            {audio && (
                <audio controls className="mt-4">
                    <source src={audio} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            )}

            <div className="mt-8 w-full max-w-2xl bg-[#23232b] p-4 rounded">
                <Bar data={progreso} options={opciones} />
            </div>

            {historial.length > 0 && (
                <div className="mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold mb-2"> Historial de ejercicios generados</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {historial.map((item, idx) => (
                            <li key={idx} className="bg-[#23232b] p-2 rounded text-[#f3f4f6]">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {sesiones.length > 0 && (
                <div className="mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold mb-2"> Sesiones guardadas en la base de datos</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {sesiones.map((s) => (
                            <li key={s.id} className="bg-[#23232b] p-2 rounded text-[#f3f4f6]">
                                <strong>Palabra:</strong> {s.palabra} <br />
                                <strong>Fecha:</strong> {new Date(s.fecha).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
