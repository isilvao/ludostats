'use client';

import React, { useState } from "react";
import Header from "../components/Header"; 
import Footer from "@/components/Footer";

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "123-456-7890",
  });

  return (
    
    <div className="bg-gray-100 min-h-screen p-6">
      <Header/>
      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mi Perfil</h1>

        <div className="flex items-center mb-6">
          <img
            src="/assets/images/profile-placeholder.svg"
            alt="Foto de perfil"
            className="rounded-full w-24 h-24 border-2 border-gray-300"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">{userInfo.name}</h2>
            <p className="text-gray-600">{userInfo.email}</p>
            <p className="text-gray-600">{userInfo.phone}</p>
          </div>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => alert("Función para editar información en desarrollo")}
        >
          Editar Información
        </button>
      </section>

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Plan de Suscripción</h2>
        <p className="text-gray-600">Plan actual: <strong>Premium</strong></p>
        <p className="text-gray-600">Fecha de renovación: <strong>01/03/2025</strong></p>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4"
          onClick={() => alert("Función para gestionar la suscripción en desarrollo")}
        >
          Gestionar Suscripción
        </button>
      </section>

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configuración de la Cuenta</h2>
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => alert("Función para cambiar contraseña en desarrollo")}
          >
            Cambiar Contraseña
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => alert("Función para eliminar cuenta en desarrollo")}
          >
            Eliminar Cuenta
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Actividad</h2>
        <ul className="text-gray-600 space-y-2">
          <li>• Partido jugado el 10/01/2025.</li>
          <li>• Suscripción renovada el 01/01/2025.</li>
          <li>• Perfil actualizado el 15/12/2024.</li>
        </ul>
      </section>
      <Footer/>
    </div>
  );
};

export default Profile;
