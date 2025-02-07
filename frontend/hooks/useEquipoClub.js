import { useContext } from "react";
import EquipoClubContext from "../contexts/equipoClubContext";

export const useEquipoClub = () => {
    const context = useContext(EquipoClubContext);
    if (!context) {
        throw new Error("useEquipoClub debe usarse dentro de EquipoClubProvider");
    }
    return context;
};
