import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { MapPinIcon, CalendarIcon, ScissorsIcon } from "@heroicons/react/24/outline";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [barberias, setBarberias] = useState([]);
  const [selectedBarberia, setSelectedBarberia] = useState(null);
  const [fecha, setFecha] = useState("");
  const [servicio, setServicio] = useState("");

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
      alert("Por favor, completa todos los campos.");
      return;
    }
    
    const { data, error } = await supabase.from("reservas").insert([
      { barberia_id: selectedBarberia, fecha, servicio }
    ]);
    
    if (error) {
      console.error("Error creando la reserva", error);
    } else {
      alert("¡Reserva creada exitosamente!");
      // Limpiar formulario después de reserva
      setSelectedBarberia(null);
      setFecha("");
      setServicio("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Encabezado */}
      <header className="text-center py-16 bg-gray-800 shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
            Legión Spartana
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Reserva tu cita con estilo - Tradición y precisión
          </p>
        </div>
      </header>

      {/* Listado de Barberías */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center border-b-2 border-amber-500 pb-4 inline-block mx-auto">
          Nuestras Barberías
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barberias.map((barberia) => (
            <div 
              key={barberia.id} 
              className="bg-gray-800 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 
                       shadow-2xl hover:shadow-3xl border border-gray-700"
            >
              <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-80"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white">{barberia.nombre}</h3>
                  <p className="text-gray-200 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {barberia.ubicacion}
                  </p>
                </div>
              </div>
              
              <button 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl
                         transition-colors duration-300 font-semibold flex items-center justify-center"
                onClick={() => setSelectedBarberia(barberia.id)}
              >
                Seleccionar
                <ScissorsIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          ))}
        </div>

        {/* Formulario de Reserva */}
        {selectedBarberia && (
          <div className="mt-16 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Completa Tu Reserva
              </span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2" />
                  Fecha y Hora
                </label>
                <input 
                  type="datetime-local" 
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-2 flex items-center">
                  <ScissorsIcon className="h-6 w-6 mr-2" />
                  Servicio
                </label>
                <select 
                  value={servicio} 
                  onChange={(e) => setServicio(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 border border-gray-600"
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="Corte Clásico">Corte Clásico</option>
                  <option value="Arreglo de Barba">Arreglo de Barba</option>
                  <option value="Corte + Barba">Combo Premium</option>
                  <option value="Tinte y Estilo">Tinte y Estilo</option>
                </select>
              </div>

              <button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                         text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02]
                         flex items-center justify-center"
                onClick={handleReserva}
              >
                Confirmar Reserva
                <CalendarIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}