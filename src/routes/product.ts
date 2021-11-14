import express from 'express';
import product from '../controllers/product';
import isLoggedIn from '../authorization/authenticate';
import {checkProductData,checkUpdatedData } from '../validation/productValidators';
const router = express.Router();


// CRUD Product
router.get('/:id',product.getProduct);
// get all product with page parameter
router.get('/viewAll/:page',product.getProducts);

router.post('/',isLoggedIn,checkProductData, product.addProduct);
router.put('/:id', isLoggedIn,checkUpdatedData, product.updateProduct);
router.delete('/:id',isLoggedIn,product.deleteProduct);


export default router ;