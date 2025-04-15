const Notificacion = {
  id: String,
  usuarioId: String,
  tipo: {
    type: String,
    enum: ['membresia', 'matricula', 'otro', 'pago', 'membresia_proxima_expiracion', 'matricula_proxima_expiracion']
  },
  mensaje: String,
  fecha_creacion: Date,
  leido: Boolean
};

module.exports = Notificacion;