const Evento = require('../models/Evento');

const crearEvento = async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin} = req.body;
    const { id_club } = req.params;

    if (!nombre || !descripcion || !fecha_inicio) {
        return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    try {
        const nuevoEvento = await Evento.create({
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            club_id: id_club
        });

        res.status(200).json({ msg: 'Evento creado correctamente', evento: nuevoEvento });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

const modificarEvento = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const evento = await Evento.findOne({ where: { id } });

        if (!evento) {
            return res.status(404).json({ msg: 'Evento no encontrado' });
        }

        await evento.update(datosActualizados);

        res.status(200).json({ msg: 'Evento actualizado correctamente', evento });
    } catch (error) {
        console.error('Error al modificar el evento:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

const obtenerEventos = async (req, res) => {

    const { id_club } = req.params;

    try {
        const eventos = await Evento.findAll({where: {club_id: id_club}});

        res.status(200).json({ eventos });
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

const obtenerEventoPorId = async (req, res) => {

    const { id } = req.params;

    try {
        const evento = await Evento.findOne({where: {id}});

        res.status(200).json({ evento });
    } catch (error) {
        console.error('Error al obtener el evento:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

const deleteEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const evento = await Evento.findOne({ where: { id } });

        if (!evento) {
            return res.status(404).json({ msg: 'Evento no encontrado' });
        }

        await evento.destroy();

        res.status(200).json({ msg: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

module.exports = {
    crearEvento,
    modificarEvento,
    obtenerEventos,
    obtenerEventoPorId,
    deleteEvento
}