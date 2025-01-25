const express = require('express')
const multiparty = require('connect-multiparty')
const clubController = require('../controllers/club')
const md_auth = require('../middleware/authenticate')
const md_clubOwn = require('../middleware/clubValidations')

const api = express.Router()
const md_upload = multiparty({uploadDir: './uploads/clubLogo'})


api.get('/myclubs', [md_auth.asureAuth, md_clubOwn.validateAdmin], clubController.getClubs) // id del gerente
api.post('/newclub', [md_auth.asureAuth, md_upload, md_clubOwn.validateGerente], clubController.createClub) // id del gerente
api.patch('/updateclub/:id_club', [md_auth.asureAuth, md_upload, md_clubOwn.validateGerente, md_clubOwn.validateClubOwnership], clubController.updateClub) // id del club
api.delete('/deleteclub/:id_club', [md_auth.asureAuth, md_clubOwn.validateGerente, md_clubOwn.validateClubOwnership], clubController.deleteClub) // id del club y del gerente

module.exports = api
