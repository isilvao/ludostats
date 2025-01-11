import { basePath, apiVersion } from "./config";

export class Auth {
    baseApiUrl = `${basePath}/${apiVersion}`;

    async register(data){
        try {
            const url = `${this.baseApiUrl}/register`;

            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                    contrasena: data.contrasena,
                    rol: 'externo',
                    activo: true
                })
            }
        } catch (error) {
            throw error
        }
    }
}