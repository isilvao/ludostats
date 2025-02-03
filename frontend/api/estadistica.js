export class estadisticaAPI {
    baseApi = `${basePath}/${apiVersion}`;

    async getMyEstadisticas(accessToken) {
        try {
            const url = `${this.baseApi}/misestadisticas`;

            const params = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateEstadistica(estadistica, accessToken) {
        // El usuario que hace la modificación se recibe por el accessToken

        try {
            const url = `${this.baseApi}/editarestadistica/${estadistica.id}`;

            const params = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(estadistica),
            }

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result;
        } catch (error) {
            throw error;
        }
    }

    async createEstadistica(tipoEstadistica, accessToken, id_usuario) {

        // El id_usuario es el id del usuario que se quiere modificar.
        // El usuario que crea la estadistica se recibe por el accessToken

        try {
            const url = `${this.baseApi}/${tipoEstadistica.id}/${id_usuario}`;

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(tipoEstadistica),
            }

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result;
        } catch (error) {
            console.error('Error al crear la estadistica:', error);
            throw error;
        }
    }

    async deleteEstadistica(id, accessToken) {
        try {
            const url = `${this.baseApi}/eliminarestadistica/${id}`;

            const params = {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result;
        } catch (error) {
            throw error;
        }
    }

}