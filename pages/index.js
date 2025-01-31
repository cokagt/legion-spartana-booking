import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [barberias, setBarberias] = useState([]);
  const [selectedBarberia, setSelectedBarberia] = useState(null);
  const [fecha, setFecha] = useState("");
  const [servicio, setServicio] = useState("");
  const [ubicacion, setUbicacion] = useState(null);

  useEffect(() => {
    async function fetchBarberias() {
      let { data, error } = await supabase.from("barberias").select("*");
      if (error) console.error("Error fetching barberías", error);
      else setBarberias(data);
    }
    fetchBarberias();
  }, []);

  const handleReserva = async () => {
    if (!selectedBarberia || !fecha || !servicio) {
      alert("Por favor, selecciona una barbería, fecha y servicio.");
      return;
    }
    
    const { data, error } = await supabase.from("reservas").insert([
      { barberia_id: selectedBarberia, fecha, servicio }
    ]);
    
    if (error) {
      console.error("Error creando la reserva", error);
    } else {
      alert("Reserva creada exitosamente");
    }
  };

  const handleObtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación", error);
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Bienvenido a Legión Spartana</h1>
      <p className="mt-2">Reserva tu cita en una de nuestras barberías aliadas.</p>
      
      <button 
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" 
        onClick={handleObtenerUbicacion}
      >
        Obtener Mi Ubicación
      </button>

      <h2 className="text-2xl font-semibold mt-6">Barberías Registradas</h2>
      <ul>
        {barberias.map((barberia) => (
          <li key={barberia.id} className="border p-4 mt-2 rounded-lg">
            <h3 className="text-xl font-bold">{barberia.nombre}</h3>
            <p>{barberia.ubicacion}</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" 
              onClick={() => setSelectedBarberia(barberia.id)}
            >
              Seleccionar
            </button>
          </li>
        ))}
      </ul>

      {selectedBarberia && (
        <div className="mt-6 border p-4 rounded-lg">
          <h2 className="text-2xl font-semibold">Reserva tu cita</h2>
          <label className="block mt-2">Fecha:</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            className="border p-2 w-full"
          />
          <label className="block mt-2">Servicio:</label>
          <input 
            type="text" 
            value={servicio} 
            onChange={(e) => setServicio(e.target.value)} 
            className="border p-2 w-full"
          />
          <button 
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded" 
            onClick={handleReserva}
          >
            Confirmar Reserva
          </button>
        </div>
      )}
    </div>
  );
}
