const UsuariosEquipos = require('../models/UsuariosEquipos');

const crearUsuarioEquipo = async (req, res) => {
    const { usuario_id, equipo_id, rol } = req.body;

    if (!usuario_id || !equipo_id || rol === undefined || rol === null) {
        return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    try {
        const nuevoRegistro = await UsuariosEquipos.create({
            usuario_id,
            equipo_id,
            rol,
        });

        res.status(201).json({ msg: 'Registro creado correctamente', registro: nuevoRegistro });
    } catch (error) {
        console.error('Error al crear el registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


const modificarUsuarioEquipo = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const registro = await UsuariosEquipos.findByPk(id);

        if (!registro) {
            return res.status(404).json({ msg: 'Registro no encontrado' });
        }

        await registro.update(datosActualizados);

        res.status(200).json({ msg: 'Registro actualizado correctamente', registro });
    } catch (error) {
        console.error('Error al modificar el registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


const borrarUsuarioEquipo = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await UsuariosEquipos.destroy({ where: { id } });

        if (!resultado) {
            return res.status(404).json({ msg: 'Registro no encontrado' });
        }

        res.status(200).json({ msg: 'Registro eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


module.exports = {
    crearUsuarioEquipo,
    modificarUsuarioEquipo,
    borrarUsuarioEquipo,

}