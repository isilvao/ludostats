class Usuario {
  constructor(
    id,
    nombre,
    apellido,
    documento,
    correo,
    telefono,
    contrasena,
    activo,
    foto,
    fecha_nacimiento,
    direccion,
    acudienteId,
    id_stripe,
    tipo_suscripcion,
    fecha_fin_suscripcion,
    ultima_transaccion_id,
    correo_validado
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.documento = documento;
    this.correo = correo;
    this.telefono = telefono;
    this.contrasena = contrasena;
    this.activo = activo;
    this.foto = foto;
    this.fecha_nacimiento = fecha_nacimiento;
    this.direccion = direccion;
    this.acudienteId = acudienteId;
    this.id_stripe = id_stripe;
    this.tipo_suscripcion = tipo_suscripcion;
    this.fecha_fin_suscripcion = fecha_fin_suscripcion;
    this.ultima_transaccion_id = ultima_transaccion_id;
    this.correo_validado = correo_validado;
  }
}

module.exports = Usuario;