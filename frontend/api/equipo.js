export class EquipoAPI {
    baseApi = `${basePath}/${apiVersion}`;
  
    async obtenerEquipoPorId(equipoId) {
      try {
        const url = `${this.baseApi}/equipos/${equipoId}`;
        const response = await fetch(url);
        const result = await response.json();
  
        if (response.status !== 200) throw new Error('Equipo no encontrado.');
  
        return result;
      } catch (error) {
        console.error('Error al obtener el equipo:', error);
        throw error;
      }
    }
  }
  