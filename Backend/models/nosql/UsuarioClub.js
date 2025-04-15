const UsuarioClub = {
  id: String,
  usuarioId: String,
  clubId: String,
  rol: {
    type: String,
    enum: ['gerente', 'entrenador', 'deportista', 'acudiente', 'miembro'],
  },
  activado: Boolean,
  fecha_fin_matricula: Date,
  transaccion_id: String,
};

module.exports = UsuarioClub;