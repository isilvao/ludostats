const Transaccion = {
  id: "",
  usuarioId: "",
  destinatarioId: "",
  tipo: "", // Enum: 'suscripcion', 'matricula', 'otro'
  concepto: "",
  clubId: "",
  equipoId: "",
  total: 0.0,
  fecha: null,
  metodo_pago: "",
};

module.exports = Transaccion;