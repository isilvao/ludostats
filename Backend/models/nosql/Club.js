class Club {
  constructor(id, nombre, descripcion, deporte, telefono, logo) {
    if (typeof id !== 'string') {
      throw new Error('El ID debe ser una cadena de texto.');
    }
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.deporte = deporte;
    this.telefono = telefono;
    this.logo = logo;
  }
}

module.exports = Club;