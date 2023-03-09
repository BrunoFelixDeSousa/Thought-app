const express = require('express')
const router = express()
const ThoughtController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/', ThoughtController.showThoughts)
router.get('/dashboard', checkAuth, ThoughtController.dashboard)
router.get('/add', checkAuth, ThoughtController.createThought)
router.post('/add', checkAuth, ThoughtController.createThoughtSave)
router.get('/edit/:id', checkAuth, ThoughtController.updateThought)
router.post('/edit', checkAuth, ThoughtController.updateThoughtPost)
router.post('/delete', checkAuth, ThoughtController.thoughtDelete)

module.exports = router