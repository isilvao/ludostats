export class tipoEstadisticasAPI {
    baseApi = `${basePath}/${apiVersion}`;

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
            const url = `${this.baseApi}/${id_club}/tipoestadisticas`
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

}