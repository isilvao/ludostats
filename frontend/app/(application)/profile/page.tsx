'use client';
import { CiCamera } from 'react-icons/ci';
import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Diego Leandro',
    lastName: 'Rodríguez',
    email: 'diego_p5h2g5@outlook.com',
    phone: '+57 312 321 3212',
    birthDate: '',
    documento: '123456789',
    acudiente: 'Juan Pérez',
    genero: 'Masculino',
    rol: 'Miembro',
    equipo: 'Equipo 1',
  });

  const [selectedOption, setSelectedOption] = useState('profile');

  const handleSave = () => {
    alert('Función de guardar en desarrollo');
  };

  const handleDeleteAccount = () => {
    alert('Función para eliminar cuenta en desarrollo');
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
        return (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-600">
                  Nombres *
                </label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  defaultValue={userInfo.firstName}
                  placeholder="Nombres"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-600">
                  Apellidos *
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  defaultValue={userInfo.lastName}
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
                  defaultValue={userInfo.documento}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Documento"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-600">
                  Correo Electrónico *
                </label>
                <Input
                  type="email"
                  name="email"
                  defaultValue={userInfo.email}
                  placeholder="Correo Electrónico"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-600">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={userInfo.phone}
                  placeholder="Teléfono"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-gray-600">
                  Fecha de Nacimiento
                </label>
                <Input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  defaultValue={userInfo.birthDate}
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
                  defaultValue={userInfo.genero}
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
                  defaultValue={userInfo.rol}
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
                  defaultValue={userInfo.acudiente}
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
                  defaultValue={userInfo.equipo}
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
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <p className="text-gray-600">{userInfo.phone}</p>
            <p className="text-gray-600">{userInfo.email}</p>
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
