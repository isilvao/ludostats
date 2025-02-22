'use client';
import { createContext, useState, useContext } from 'react';

const EquipoClubContext = createContext();

export const EquipoClubProvider = ({ children }) => {
  const [equipoData, setEquipoData] = useState(null);
  const [rolEquipo, setRolEquipo] = useState(null);
  const [clubData, setClubData] = useState(null);
  const [rolClub, setRolClub] = useState(null);

  // 📌 Función para actualizar el equipo y el club asociado
  const setEquipoSeleccionado = (equipoData, rol, clubData) => {
    setEquipoData(equipoData);
    setRolEquipo(rol);
    setClubData(clubData);
  };

  // 📌 Función para actualizar solo el club
  const setClubSeleccionado = (clubData, rol) => {
    setClubData(clubData);
    setRolClub(rol);
  };

  // 📌 Función para resetear el contexto
  const resetDatos = () => {
    setEquipoData(null);
    setRolEquipo(null);
    setClubData(null);
    setRolClub(null);
  };

  // 📌 Función para actualizar el logo del club
  const updateClubLogo = (newLogoUrl) => {
    setClubData((prevClubData) => ({
      ...prevClubData,
      logo: newLogoUrl,
    }));
  };

  return (
    <EquipoClubContext.Provider
      value={{
        equipoData,
        setEquipoData,
        rolEquipo,
        setRolEquipo,
        clubData,
        setClubData,
        rolClub,
        setRolClub,
        setEquipoSeleccionado,
        setClubSeleccionado,
        resetDatos,
        updateClubLogo, // Añadir la función al contexto
      }}
    >
      {children}
    </EquipoClubContext.Provider>
  );
};

// 📌 Exportar el contexto para usarlo en `useEquipoClub`
export default EquipoClubContext;
