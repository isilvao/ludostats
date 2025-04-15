class Galeria {
  constructor(id, titulo, descripcion, imagen_url, clubId, equipoId) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.imagen_url = imagen_url;
    this.clubId = clubId;
    this.equipoId = equipoId;
  }
}

module.exports = Galeria;