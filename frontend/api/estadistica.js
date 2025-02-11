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
            console.error('Error al crear la estadistica:', error);
            throw error;
        }
    }

    async getAllEstadisticas(accessToken, id_tipoEstadistica) {
        // Se buscan todas las estadisticas de un tipo especifico
        try {
            const url = `${this.baseApi}/estadisticas/${id_tipoEstadistica}`;

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
            console.error('Error al obtener todas las estadisticas:', error);
            throw error
        }
    }

    // TIPO DE ESTADISTICAS
    async createTipoEstadistica(tipoEstadistica, accessToken, id_club){
        try {
            const url = `${this.baseApi}/${id_club}/newtipoestadistica` //Se pasa el id del club como parametro a la url

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(tipoEstadistica),
            }

            const response = await fetch(url, params)
            const result = await response.json()

            if (response.status !== 200) throw result

            return result
        } catch (error) {
            console.error('Error al crear el tipo de estadistica:', error);
            throw error;
        }
    }

    async getTipoEstadistica(id_club, accessToken){
        try {
            const url = `${this.baseApi}/tipoestadistica/club/${id_club}`
            const params = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw new Error('Tipo de estadistica no encontrado.');

            return result;
        } catch (error) {
            console.error('Error al obtener el tipo de estadistica:', error);
            throw error;
        }
    }

    async updateTipoEstadistica(tipoEstadistica, accessToken, id_club){
        try {
            const url = `${this.baseApi}/${id_club}/updatetipoestadistica/${tipoEstadistica.id}`;

            const params = {
                method: 'PATCH',
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
            console.error('Error al modificar el tipo de estadistica:', error);
            throw error;
        }
    }

    async deleteTipoEstadistica(tipoEstadistica, accessToken, id_club){
        try {
            const url = `${this.baseApi}/${id_club}/deletetipoestadistica/${tipoEstadistica.id}`;

            const params = {
                method: 'DELETE',
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
            console.error('Error al eliminar el tipo de estadistica:', error);
            throw error;
        }
    }

    async getTipoEstadisticaByTeam(id_team, accessToken){
        try {
            const url = `${this.baseApi}/estadisticas/:id_tipoestadistica/${id_team}`;

            const params = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw new Error('Tipo de estadistica no encontrado.');

            return result;
        } catch (error) {
            console.error('Error al obtener el tipo de estadistica por equipo:', error);
        }
        throw error;
    }
}