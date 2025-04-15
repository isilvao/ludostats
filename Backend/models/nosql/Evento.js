class Evento {
  constructor(id, titulo, descripcion, fecha_inicio, fecha_fin, clubId) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.clubId = clubId;
  }
}

module.exports = Evento;