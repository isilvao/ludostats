const Evento = require('../models/Evento');
const EventoDependencia = require('../models/EventoDependencia');
const { Op, Sequelize } = require('sequelize');

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




/////////////////////////////////////////
////EVENTOS DEPENDENCIA////////



const crearEventoConDependencias = async (req, res) => {
    const { titulo, descripcion, fecha_inicio, fecha_fin, club_id, equipo_ids } = req.body;

    if (!titulo || !descripcion || !fecha_inicio) {
        return res.status(400).json({ msg: "Faltan datos obligatorios para crear el evento" });
    }

    if (!club_id && (!equipo_ids || equipo_ids.length === 0)) {
        return res.status(400).json({ msg: "Debe asignar el evento a un club o al menos un equipo" });
    }

    try {
        // 📌 Crear el evento
        const nuevoEvento = await Evento.create({
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            club_id: club_id || null  // Opcional
        });

        // 📌 Crear dependencias
        if (club_id) {
            await EventoDependencia.create({
                evento_id: nuevoEvento.id,
                club_id,
                equipo_id: null
            });
        }

        if (equipo_ids && equipo_ids.length > 0) {
            const dependenciasEquipos = equipo_ids.map(equipo_id => ({
                evento_id: nuevoEvento.id,
                club_id: null,
                equipo_id
            }));

            await EventoDependencia.bulkCreate(dependenciasEquipos);
        }

        res.status(201).json({ msg: "Evento creado correctamente", evento: nuevoEvento });
    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};



const obtenerEventosPorClub = async (req, res) => {
    const { club_id } = req.params;

    try {
        const eventos = await EventoDependencia.findAll({
            where: { club_id },
            include: [{ model: Evento, as: 'evento' }]
        });

        res.status(200).json(eventos);
    } catch (error) {
        console.error("❌ Error al obtener eventos del club:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const obtenerEventosPorEquipo = async (req, res) => {
    const { equipo_id } = req.params;

    try {
        const eventos = await EventoDependencia.findAll({
            where: { equipo_id },
            include: [{ model: Evento, as: 'evento' }]
        });

        res.status(200).json(eventos);
    } catch (error) {
        console.error("❌ Error al obtener eventos del equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};



/////////////////////////////////////////
////EVENTOS DEPENDENCIA////////
//////////NUEVOS METODOS///////////



const obtenerEventosCercanosPorClub = async (req, res) => {
    const { club_id } = req.params;
    const ahora = new Date();
    const hoy = ahora.toISOString().split("T")[0]; // 🔹 Extraer solo la fecha (YYYY-MM-DD)

    try {
        // 🔹 Evento más reciente en el pasado (incluyendo eventos de hoy)
        const eventoPasado = await EventoDependencia.findOne({
            where: { club_id },
            include: [{
                model: Evento,
                as: 'evento',
                where: Sequelize.literal(`DATE(fecha_inicio) <= '${hoy}'`) // 📌 Comparar solo fecha
            }],
            order: [[{ model: Evento, as: 'evento' }, 'fecha_inicio', 'DESC']],
            raw: true,
            nest: true
        });

        // 🔹 Evento más próximo en el futuro (excluyendo eventos de hoy)
        const eventoFuturo = await EventoDependencia.findOne({
            where: { club_id },
            include: [{
                model: Evento,
                as: 'evento',
                where: Sequelize.literal(`DATE(fecha_inicio) > '${hoy}'`) // 📌 Comparar solo fecha
            }],
            order: [[{ model: Evento, as: 'evento' }, 'fecha_inicio', 'ASC']],
            raw: true,
            nest: true
        });

        res.status(200).json({
            eventoPasado: eventoPasado || null,
            eventoFuturo: eventoFuturo || null
        });
    } catch (error) {
        console.error("❌ Error al obtener los eventos cercanos del club:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const obtenerEventosCercanosPorEquipo = async (req, res) => {
    const { equipo_id } = req.params;
    const ahora = new Date();
    const hoy = ahora.toISOString().split("T")[0]; // 🔹 Extraer solo la fecha (YYYY-MM-DD)

    try {
        // 🔹 Evento más reciente en el pasado (incluyendo eventos de hoy)
        const eventoPasado = await EventoDependencia.findOne({
            where: { equipo_id },
            include: [{
                model: Evento,
                as: 'evento',
                where: Sequelize.literal(`DATE(fecha_inicio) <= '${hoy}'`) // 📌 Comparar solo fecha
            }],
            order: [[{ model: Evento, as: 'evento' }, 'fecha_inicio', 'DESC']],
            raw: true,
            nest: true
        });

        // 🔹 Evento más próximo en el futuro (excluyendo eventos de hoy)
        const eventoFuturo = await EventoDependencia.findOne({
            where: { equipo_id },
            include: [{
                model: Evento,
                as: 'evento',
                where: Sequelize.literal(`DATE(fecha_inicio) > '${hoy}'`) // 📌 Comparar solo fecha
            }],
            order: [[{ model: Evento, as: 'evento' }, 'fecha_inicio', 'ASC']],
            raw: true,
            nest: true
        });

        res.status(200).json({
            eventoPasado: eventoPasado || null,
            eventoFuturo: eventoFuturo || null
        });
    } catch (error) {
        console.error("❌ Error al obtener los eventos cercanos del equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};




module.exports = {
    crearEvento,
    modificarEvento,
    obtenerEventos,
    obtenerEventoPorId,
    deleteEvento,
    crearEventoConDependencias,
    obtenerEventosPorClub,
    obtenerEventosPorEquipo,
    obtenerEventosCercanosPorEquipo,
    obtenerEventosCercanosPorClub


}