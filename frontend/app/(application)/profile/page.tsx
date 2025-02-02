'use client';
import { CiCamera } from 'react-icons/ci';
import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../../hooks';
import { Loader2 } from 'lucide-react';
import { User, Auth } from '../../../api';
import { getProfileImage } from '@/lib/utils';
import LoadingScreen from '@/components/LoadingScreen';

const Profile = () => {
  const userController = new User();
  const authController = new Auth();
  const { logout, user, accessToken } = useAuth();
  const [selectedOption, setSelectedOption] = useState('profile');

  if (!user) {
    return <LoadingScreen />;
  }

  //Modificar esta funcion por un async y poner await antes del userController.updateMe
  const handleSave = () => {
    const data = {
      id: user.id,
      nombre: '',
      apellido: '',
      documento: '',
      correo: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: '',
    };

    console.log(data);
    //const result = userController.updateMe(accessToken, data)

    alert('Función para guardar cambios en desarrollo');
  };

  // Cambiar esta funcion por un async y poner await antes del userController.deleteMe
  const handleDeleteAccount = () => {
    const result = userController.deteleMe(accessToken, user.id);

    // if (result.success) {
    //   alert('Cuenta eliminada con éxito')
    // }

    alert('Función para eliminar cuenta en desarrollo');
  };

  const handleSignOut = async () => {
    try {
      await logout(); // Espera a que logout termine
      console.log(user); // Imprime user después de que logout finalice
      window.location.href = '/';
    } catch (error) {
      console.log('Error during logout:', error);
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
                  defaultValue={user.nombre}
                  placeholder="Nombres"
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block text-gray-600">
                  Apellidos *
                </label>
                <Input
                  type="text"
                  id="apellido"
                  name="apellido"
                  defaultValue={user.apellido}
                  placeholder="Apellido"
                />
              </div>
              <div>
                <label htmlFor="documento" className="block text-gray-600">
                  Documento
                </label>
                <Input
                  type="number"
                  id="documento"
                  name="documento"
                  defaultValue={user.documento}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Documento"
                />
              </div>
              <div>
                <label htmlFor="correo" className="block text-gray-600">
                  Correo Electrónico *
                </label>
                <Input
                  type="correo"
                  name="correo"
                  defaultValue={user.correo}
                  placeholder="Correo Electrónico"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-gray-600">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  defaultValue={user.telefono}
                  placeholder="Teléfono"
                />
              </div>
              <div>
                <label
                  htmlFor="fecha_nacimiento"
                  className="block text-gray-600"
                >
                  Fecha de Nacimiento
                </label>
                <Input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  defaultValue={user.fecha_nacimiento}
                  placeholder="Fecha de Nacimiento"
                />
              </div>
              <div>
                <label htmlFor="genero" className="block text-gray-600">
                  Género
                </label>
                <select
                  id="genero"
                  name="genero"
                  defaultValue={user.genero}
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
                src={getProfileImage(user)}
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
              onClick={handleSignOut}
              //onClick={logout()}
            >
              Cerrar sesión
            </li>
            <li
              className="pl-6 text-[#FF0000] cursor-pointer p-3 hover:bg-gray-100"
              onClick={handleDeleteAccount}
              //onClick={logout()}
            >
              Borrar mi cuenta
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
