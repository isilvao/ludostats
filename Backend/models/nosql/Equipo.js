class Equipo {
  constructor(id, nombre, descripcion, telefono, nivelPractica, logo, clubId) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.telefono = telefono;
    this.nivelPractica = nivelPractica;
    this.logo = logo;
    this.clubId = clubId;
  }
}

module.exports = Equipo;