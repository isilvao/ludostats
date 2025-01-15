'use client';
import { CiCamera } from 'react-icons/ci';
import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useAuth } from "../../../hooks"
import { Loader2 } from 'lucide-react'
import { User, Auth } from '../../../api'


const Profile = () => {
  const userController = new User();
  const authController = new Auth();
  const { user, accessToken, logout } = useAuth();
  const [selectedOption, setSelectedOption] = useState('profile');
  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    apellido: user.apellido || "",
    documento: user.documento || "",
    correo: user.correo || "",
    telefono: user.telefono || "",
    fecha_nacimiento: user.fecha_nacimiento || "",
    genero: user.genero || "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold mt-4 text-foreground">Loading...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we fetch your data.</p>
      </div>
    )
  }

  //Modificar esta funcion por un async y poner await antes del userController.updateMe
  const handleSave = async () => {
    try {
      const result = await userController.updateMe(accessToken, formData, user.id);

      if (result.success) {
        alert("¡Cambios guardados con éxito!");
      } else {
        alert("Error al guardar los cambios: " + result.message);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Ocurrió un error al intentar guardar los cambios. Intenta nuevamente.");
    }
  };


  // Función para eliminar la cuenta
  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");

      if (!confirmDelete) return;

      const result = await userController.deteleMe(accessToken, user.id);

      if (result.success) {
        alert("Cuenta eliminada con éxito. Serás redirigido al inicio.");
        logout(); // Cierra la sesión del usuario
      } else {
        alert("Error al eliminar la cuenta: " + result.message);
      }
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert("Ocurrió un error al intentar eliminar la cuenta. Intenta nuevamente.");
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
        return (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-gray-600">
                  Nombres *
                </label>
                <Input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombres"
                />
                <Input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellidos"
                />
                <Input
                  type="number"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleInputChange}
                  placeholder="Documento"
                />
                <Input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="Correo Electrónico"
                />
                <Input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                />
                <Input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  placeholder="Fecha de Nacimiento"
                />
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="rol" className="block text-gray-600">
                  Rol
                </label>
                <Input
                  type="text"
                  id="rol"
                  name="rol"
                  defaultValue={user.rol}
                  placeholder="Rol"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="acudiente" className="block text-gray-600">
                  Acudiente
                </label>
                <Input
                  type="text"
                  id="acudiente"
                  name="acudiente"
                  defaultValue={user.acudiente}
                  placeholder="Acudiente"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="equipo" className="block text-gray-600">
                  Equipo
                </label>
                <Input
                  type="text"
                  id="equipo"
                  name="equipo"
                  defaultValue={user.equipo}
                  placeholder="Equipo"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-green text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Guardar
            </button>
          </form>
        );
      case 'preferences':
        return (
          <form className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-gray-600">
                Antigua Contraseña
              </label>
              <Input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="*************"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-gray-600">
                Nueva Contraseña
              </label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="*************"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-600">
                Confirmar Contraseña
              </label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="*************"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                alert('Función para cambiar contraseña en desarrollo')
              }
              className="bg-green text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Guardar
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-10 mx-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mi Perfil</h1>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* Profile Sidebar */}
        <div className="bg-white px-0 py-10 border border-gray-300 rounded-md md:w-1/4 mb-4 md:mb-0 h-full">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src="/assets/images/person-1.png"
                alt="Foto de perfil"
                className="rounded-full w-24 h-24 "
                width={100}
                height={100}
              />
              <button
                className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full hover:bg-gray-300 h-10 w-10 flex items-center justify-center border border-spacing-1 border-white"
                onClick={() => alert('Función para cambiar foto en desarrollo')}
              >
                <CiCamera className="h-6 w-6" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {user.nombre} {user.apellido}
            </h2>
            <p className="text-gray-600">{user.telefono}</p>
            <p className="text-gray-600">{user.correo}</p>
          </div>
          <ul className="mt-6">
            <li
              className={`pl-6 cursor-pointer p-3 border-l-4 ${selectedOption === 'profile' ? 'bg-gray-200 border-l-green' : 'hover:bg-gray-100 border-l-transparent'}`}
              onClick={() => setSelectedOption('profile')}
            >
              Perfil
            </li>
            <li
              className={`pl-6 cursor-pointer p-3 border-l-4 ${selectedOption === 'preferences' ? 'bg-gray-200 border-l-green' : 'hover:bg-gray-100 border-l-transparent'}`}
              onClick={() => setSelectedOption('preferences')}
            >
              Preferencias
            </li>
            <li
              className="pl-6 text-[#FF0000] cursor-pointer p-3 hover:bg-gray-100"
              onClick={handleDeleteAccount}
            >
              Boorar mi cuenta
            </li>
          </ul>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-white p-6 border border-gray-300 rounded-md md:w-[75%] w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedOption === 'profile'
              ? 'Editar mi información'
              : 'Preferencias'}
          </h1>
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Profile;
