const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.loadLesSauces);
router.get('/:id', auth, saucesCtrl.loadLaSauces);
router.post('/', auth, multer, saucesCtrl.saveSauces);
router.put('/:id', auth, multer, saucesCtrl.updateSauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.likeSauces);

module.exports = router;