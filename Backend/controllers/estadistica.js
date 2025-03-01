//Controller
const Estadistica = require('../models/Estadistica');
const tipoEstadistica = require('../models/TipoEstadistica')
const Club = require('../models/Club')
const Equipo = require('../models/Equipo')
const Usuario = require('../models/Usuario')
const UsuarioClub = require('../models/UsuarioClub')
const UsuariosEquipos = require('../models/UsuariosEquipos')
const { Op } = require('sequelize');
const moment = require('moment');

async function getMyEstadisticas(req, res) {
    const { id_team, id_user } = req.params

    try {
        const estadisticas = await Estadistica.findAll({
            where: { usuario_id: id_user, equipo_id: id_team }, include: {
                model: tipoEstadistica,
                as: "tipoEstadistica",
                attributes: ['nombre']
            }
        })
        res.status(200).send(estadisticas)
    } catch (error) {
        res.status(500).send({ msg: "Error al consultar las estadisticas" })
    }
}

async function createEstadistica(req, res) {
    const { id_tipoestadistica, id_usuario, id_team } = req.params

    const { valor, fecha } = req.body

    try {

        await Estadistica.create({
            tipoEstadistica_id: id_tipoestadistica,
            usuario_id: id_usuario,
            equipo_id: id_team,
            valor: valor,
            fecha: fecha
        }).then((estadisticaStored) => {
            if (!estadisticaStored) {
                return res.status(400).send({ msg: "No se pudo crear la estadistica" })
            }
            return res.status(200).send(estadisticaStored)
        }).catch((err) => {
            return res.status(500).send({ msg: "Error al crear la estadistica" })
        })
    } catch (error) {
        return res.status(500).send({ msg: "Error al crear la estadistica", error })
    }
}

async function updateEstadistica(req, res) {
    const { id_estadistica } = req.params

    try {
        Estadistica.update({
            valor: req.body.valor,
            fecha: req.body.fecha
        }, { where: { id: id_estadistica } }).then((estadistica) => {
            if (!estadistica) {
                return res.status(400).send({ msg: "No se pudo encontrar la estadistica" })
            }
            return res.status(200).send(estadistica)
        }).catch((err) => {
            return res.status(500).send({ msg: "Error al actualizar la estadistica" })
        })

    } catch (error) {
        return res.status(500).send({ msg: "Error al actualizar la estadistica" })
    }
}

async function deleteEstadistica(req, res) {
    const { id_estadistica } = req.params

    try {
        const estadistica = await Estadistica.findByPk(id_estadistica)

        estadistica.destroy().then(() => {
            return res.status(200).send({ msg: "Estadistica eliminada correctamente" })
        }).catch((err) => {
            return res.status(500).send({ msg: "Error al eliminar la estadistica" })
        })
    } catch (error) {
        return res.status(500).send({ msg: "Error al eliminar la estadistica" })
    }
}

async function getAllEstadisticas(req, res) {
    const { id_tipoestadistica } = req.params

    try {
        const usuarios = await Estadistica.findAll({
            where: { tipoEstadistica_id: id_tipoestadistica },
            include: [{
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido']
            },
            {
                model: Equipo,
                as: "equipo",
                attributes: ['nombre']
            }
            ]
        })

        return res.status(200).send(usuarios)
    } catch (error) {
        return res.status(500).send({ msg: "Error al consultar las estadisticas" })
    }
}

// TODO: Implementar la función getAllEstadisticasInTeam
async function getAllEstadisticasInTeam(req, res) {
    const { id_tipoestadistica, id_team } = req.params

    try {
        const usuarios = await UsuariosEquipos.findAll({
            where: { equipo_id: id_team, [Op.or]: [{ rol: 'deportista' }, { rol: 'miembro' }] },
            include: {
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido'],
                include: {
                    model: Estadistica,
                    as: "estadisticas",
                    where: { tipoEstadistica_id: id_tipoestadistica }
                }
            }
        })

        const estadisticas = usuarios.flatMap(usuario => {
            if (!usuario.usuario || usuario.usuario.estadisticas.length === 0) {
                return [];
            }
            return usuario.usuario.estadisticas.map(estadistica => ({
                id: estadistica.id,
                usuario_id: estadistica.usuario_id,
                tipoEstadistica_id: estadistica.tipoEstadistica_id,
                valor: estadistica.valor,
                fecha: estadistica.fecha,
                createdAt: estadistica.createdAt,
                updatedAt: estadistica.updatedAt,
                usuario: {
                    nombre: usuario.usuario.nombre,
                    apellido: usuario.usuario.apellido
                }
            }));
        });

        return res.status(200).send(estadisticas)
    } catch (error) {
        return res.status(500).send({ msg: "Error al consultar las estadisticas", error })
    }
}

async function diagramaBarrasEstadisticaPorEquipo(req, res) {
    const { id_tipoestadistica, id_team } = req.params;

    try {
        const estadisticas = await Estadistica.findAll({
            where: {
                tipoEstadistica_id: id_tipoestadistica, equipo_id: id_team,
            },
            include: {
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido'],
            }
        })

        const datosPorMes = {};
        const cantidadDatosMes = {}

        estadisticas.forEach(estadistica => {
            const mes = moment(estadistica.fecha).format("MMMM");
            if (!datosPorMes[mes]) {
                cantidadDatosMes[mes] = 0;
                datosPorMes[mes] = 0;
            }
            datosPorMes[mes] += parseFloat(estadistica.valor);
            cantidadDatosMes[mes]++;
        })

        const estadisticasPorMes = Object.keys(datosPorMes).map(mes => {
            return { mes: mes, total: datosPorMes[mes] / cantidadDatosMes[mes] };
        });

        const mesesOrdenados = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        estadisticasPorMes.sort((a, b) => {
            return mesesOrdenados.indexOf(a.mes) - mesesOrdenados.indexOf(b.mes);
        });

        res.status(200).send(estadisticasPorMes);
    } catch (error) {
        return res.status(500).send({ msg: "Error al consultar las estadisticas", error });
    }
}

async function diagramaBarrasEstadisticaPorClub(req, res) {
    const { id_tipoestadistica } = req.params;

    try {
        const estadisticas = await Estadistica.findAll({
            where: {
                tipoEstadistica_id: id_tipoestadistica
            },
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ['nombre', 'apellido'],
                },
                {
                    model: Equipo,
                    as: "equipo",
                    attributes: ['nombre'],
                }
            ]
        })

        const datosPorEquipo = {}
        const cantidadDatosEquipo = {}

        estadisticas.forEach(estadistica => {
            const equipo = estadistica.equipo.nombre;
            if (!datosPorEquipo[equipo]) {
                datosPorEquipo[equipo] = {};
                cantidadDatosEquipo[equipo] = {};
            }

            const mes = moment(estadistica.fecha).format("MMMM");
            if (!datosPorEquipo[equipo][mes]) {
                cantidadDatosEquipo[equipo][mes] = 0;
                datosPorEquipo[equipo][mes] = 0;
            }
            datosPorEquipo[equipo][mes] += parseFloat(estadistica.valor);
            cantidadDatosEquipo[equipo][mes]++;

        })

        const mesesOrdenados = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const datosPorEquipoOrdenados = {};
        Object.keys(datosPorEquipo).forEach(equipo => {
            datosPorEquipoOrdenados[equipo] = {};
            mesesOrdenados.forEach(mes => {
                if (datosPorEquipo[equipo][mes]) {
                    datosPorEquipoOrdenados[equipo][mes] = datosPorEquipo[equipo][mes];
                }
            });
        });

        return res.status(200).send(datosPorEquipo);

    } catch (error) {
        return res.status(500).send({ msg: "Error al consultar las estadisticas", error });
    }
}

async function diagramaUsuariosDeEquipos(req, res) {
    const { id_team } = req.params;

    try {
        const usuarios = await UsuariosEquipos.findAll({
            where: { equipo_id: id_team },
            include: {
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido', 'createdAt'],
            }
        });

        const usuariosPorMes = {};

        usuarios.forEach(usuario => {
            const mes = moment(usuario.usuario.createdAt).format("MMMM");

            if (!usuariosPorMes[mes]) {
                usuariosPorMes[mes] = 0;
            }
            usuariosPorMes[mes]++;
        });

        let totalUsuarios = 0
        for (const key in usuariosPorMes) {
            console.log(key)
            totalUsuarios += usuariosPorMes[key];
            usuariosPorMes[key] = totalUsuarios;
        }

        chartData = Object.keys(usuariosPorMes).map(mes => {
            return { mes: mes, totalUsuarios: usuariosPorMes[mes] };
        });

        const mesesOrdenados = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        chartData.sort((a, b) => {
            return mesesOrdenados.indexOf(a.mes) - mesesOrdenados.indexOf(b.mes);
        });

        res.status(200).send(chartData);
    } catch (error) {
        return res.status(500).send({ msg: "Error al consultar las estadisticas", error });
    }
}

async function diagramaUsuariosDeClubes(req, res) {
    const { id_club } = req.params;

    try {
        const usuarios = await UsuarioClub.findAll({
            where: { club_id: id_club },
            include: {
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido', 'createdAt'],
            }
        });

        const usuariosPorMes = {};

        usuarios.forEach(usuario => {
            const mes = moment(usuario.usuario.createdAt).format("MMMM");

            if (!usuariosPorMes[mes]) {
                usuariosPorMes[mes] = 0;
            }
            usuariosPorMes[mes]++;
        });

        let totalUsuarios = 0
        for (const key in usuariosPorMes) {
            console.log(key)
            totalUsuarios += usuariosPorMes[key];
            usuariosPorMes[key] = totalUsuarios;
        }

        chartData = Object.keys(usuariosPorMes).map(mes => {
            return { mes: mes, totalUsuarios: usuariosPorMes[mes] };
        });

        const mesesOrdenados = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        chartData.sort((a, b) => {
            return mesesOrdenados.indexOf(a.mes) - mesesOrdenados.indexOf(b.mes);
        });

        res.status(200).send(chartData);
    } catch (error) {
        return res.status(500).send({ msg: "Error al consultar las estadisticas", error });
    }
}

module.exports = {
    getMyEstadisticas,
    createEstadistica,
    updateEstadistica,
    deleteEstadistica,
    getAllEstadisticas,
    getAllEstadisticasInTeam,
    diagramaBarrasEstadisticaPorEquipo,
    diagramaUsuariosDeEquipos,
    diagramaUsuariosDeClubes,
    diagramaBarrasEstadisticaPorClub
}