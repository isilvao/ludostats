const jwt = require('../utils/jwt');

function asureAuth(req, res, next){


    if (!req.headers.authorization) {
        return res.status(403).send({msg: 'No tienes autorización'})
    }

    const token = req.headers.authorization.replace("Bearer ", "")

    try {
        const payload = jwt.decodeToken(token)

        const { exp } = payload
        const currentDate = new Date().getTime()

        if (exp <= currentDate) {
            return res.status(400).send({msg: 'Token expirado'})
        }

        req.user = payload

        next()
    } catch (error) {
        res.status(400).send({msg: 'Token inválido'})
    }
}

module.exports = {
    asureAuth
}