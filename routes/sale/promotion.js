const router = require('express').Router()
const multer = require('multer')
const upload = multer()
const { index, create, update, detail, disable, _import, batch } = require('../../controllers/promotionController')
const security = require('../../middleware/security')
const { privilege } = require('../../constants/roleMap')

router.get('/', security.role(privilege.promotion.list), (req, res) => {
    index(req, res)
})

router.get('/detail/:id', security.role(privilege.promotion.detail), (req, res) => {
    detail(req, res)
})

router.post('/create', security.role(privilege.promotion.create), (req, res) => {
    create(req, res)
})

router.put('/update/:id', security.role(privilege.promotion.update), (req, res) => {
    update(req, res)
})

router.delete('/disable/:id', security.role(privilege.promotion.delete), (req, res) => {
    disable(req, res)
})

router.post('/excel/import', upload.single('excel'), (req, res) => {
    _import(req, res)
})

router.post('/batch', (req, res) => {
    batch(req, res)
})

module.exports = router