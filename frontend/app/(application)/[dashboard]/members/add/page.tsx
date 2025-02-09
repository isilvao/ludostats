'use client';
import { FaClipboard, FaWhatsapp, FaFacebook, FaCheck } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import { useState } from 'react';
import { InvitacionesAPI } from '@/api/invitacion';
import { useEquipoClub } from '@/hooks';
import { useAuth } from '@/hooks';

export default function AddMembersPage() {
  const [iconCopied, setIconCopied] = useState(false);
  const [iconCopiedLink, setIconCopiedLink] = useState(false);
  const [teamCode, setTeamCode] = useState('4BJT1SMP8Q');
  const [teamLink, setTeamLink] = useState(
    'https://www.ludostats.com/join/4BJT1SMP8Q/'
  );
  const invitacionesAPI = new InvitacionesAPI();
  const { equipo } = useEquipoClub();
  const { user } = useAuth();

  const handleGenerateNewCode = async () => {
    try {
      const newCode = await invitacionesAPI.crearInvitacion(
        equipo.id,
        'rolStr',
        user.id
      );
      setTeamCode(newCode);
      setTeamLink(`https://www.ludostats.com/join/${newCode}/`);
    } catch (error) {
      console.error('Error al generar una nueva invitación:', error);
    }
  };

  return (
    <section>
      <h1 className="h2 mb-2">Añadir miembros</h1>

      <div className="w-full mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
        <p className="text-gray-600 mb-4 text-center h3">
          Comparte el enlace o el código que permite unirse al equipo.
        </p>
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-2 rounded-md"
          role="alert"
        >
          <p className="text-sm">
            Con este código, los miembros podrán acceder a la página web
            LudoStats, pulsar en "Unirme" e introducir el código.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Código de equipo */}
          <div className="bg-[#F4F5F5] p-8 border rounded-lg flex flex-col items-center gap-2">
            <p className="mb-4 body-1 text-gray-800 text-center">
              Comparte el código con todos los miembros de tu equipo, si
              necesitas cambiar el codigo haz click en el link "Cambiar código"
            </p>
            <h2 className="body-2 mt-4 text-gray-500">
              El código de tu equipo
            </h2>
            <div className="bg-white border border-gray-300 rounded-lg flex items-center mb-4 lg:max-w-80">
              <input
                type="text"
                value={teamCode}
                readOnly
                className="w-full p-2 focus:outline-none h3 text-gray-800 ml-4"
              />
              <button
                className="bg-white border-l border-gray-300 p-4 text-black rounded-r-md hover:text-gray-700"
                onClick={() => {
                  navigator.clipboard.writeText(teamCode);
                  setIconCopied(true);
                }}
                disabled={iconCopied}
              >
                {iconCopied ? (
                  <FaCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <FaClipboard className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              className="text-slate-800 underline hover:text-slate-700"
              onClick={handleGenerateNewCode}
            >
              Cambiar código
            </button>
          </div>

          {/* Enlace para compartir */}
          <div className="bg-[#F4F5F5] p-8 border rounded-lg flex flex-col items-center gap-2">
            <p className="mb-4 body-1 text-gray-800 text-center">
              Copia y pega el enlace y envíalo a los miembros de tu equipo (o a
              sus padres) por correo electrónico, Facebook, Whatsapp...
            </p>
            <h2 className="body-2 mt-4 text-gray-500">El link de tu equipo</h2>
            <div className="bg-white border border-gray-300 rounded-lg flex items-center mb-4 w-full">
              <input
                type="text"
                value={teamLink}
                readOnly
                className="w-full p-2 focus:outline-none h3 text-gray-800 ml-4"
              />
              <button
                className="bg-white border-l border-gray-300 p-4 text-black rounded-r-md hover:text-gray-700"
                onClick={() => {
                  navigator.clipboard.writeText(teamLink);
                  setIconCopiedLink(true);
                }}
                disabled={iconCopiedLink}
              >
                {iconCopiedLink ? (
                  <FaCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <FaClipboard className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex gap-10 mt-4 items-center">
              <a
                href={`mailto:?subject=Únete a nuestro equipo en Ludostats&body=Únete a nuestro equipo usando este enlace: ${teamLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-700"
              >
                <IoIosMail className="w-10 h-10" />
              </a>
              <a
                href={`https://wa.me/?text=Únete a nuestro equipo en Ludostats: ${teamLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-700"
              >
                <FaWhatsapp className="w-8 h-8" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${teamLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-700"
              >
                <FaFacebook className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
