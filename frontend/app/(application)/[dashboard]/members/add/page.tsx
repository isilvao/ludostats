import { FaClipboard, FaWhatsapp, FaFacebook } from 'react-icons/fa';

export default function AddMembersPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Añadir miembros</h1>
      <p className="text-gray-600 mb-4">
        Comparte el enlace o el código que permite unirse al equipo.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Código de equipo */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">El código de tu equipo</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value="4BJT1SMP8Q"
              readOnly
              className="w-full p-2 border rounded-l-md focus:outline-none"
            />
            <button className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">
              <FaClipboard className="w-5 h-5" />
            </button>
          </div>
          <a href="#" className="text-blue-500 underline hover:text-blue-700">
            Descarga el archivo PDF que deseas compartir
          </a>
        </div>

        {/* Enlace para compartir */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Copia y pega el enlace y envíalo a los miembros de tu equipo
          </h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value="https://app.sporteasy.net/es/join/4BJT1SMP8Q/"
              readOnly
              className="w-full p-2 border rounded-l-md focus:outline-none"
            />
            <button className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">
              <FaClipboard className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
              <FaWhatsapp className="w-6 h-6" />
            </button>
            <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800">
              <FaFacebook className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
