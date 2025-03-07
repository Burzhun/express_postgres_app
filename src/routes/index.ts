import {Router} from 'express'
import productController from '../controllers/productController'
import skinportController from '../controllers/skinportController'

var router = Router();

/* GET home page. */
router.get('/buy',productController.updateUserBalance);
router.get('/items',skinportController.getItems);
router.get('/product/:id',productController.getProduct);

export default router;
