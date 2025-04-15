class Estadistica {
  constructor(id, usuarioId, tipoEstadisticaId, equipoId, valor, fecha) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.tipoEstadisticaId = tipoEstadisticaId;
    this.equipoId = equipoId;
    this.valor = valor;
    this.fecha = fecha;
  }
}

module.exports = Estadistica;