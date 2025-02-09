import React from 'react';
import { FaTools } from 'react-icons/fa';

const InicioPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <FaTools size={100} color="#FF6347" />
      <h1 style={{ fontSize: '2.5em', color: '#FF6347' }}>¡En desarrollo!</h1>
      <p style={{ fontSize: '1.2em', color: '#555' }}>
        Estamos trabajando duro para traerte nuevas funcionalidades. ¡Vuelve
        pronto!
      </p>
    </div>
  );
};

export default InicioPage;
