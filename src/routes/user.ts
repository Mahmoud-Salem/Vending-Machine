import express from 'express';
import user from '../controllers/user';
import isLoggedIn from '../authorization/authenticate';
import {checkRegisterData, checkLoginData, checkDeposit, checkBuying } from '../validation/userValidators';
const router = express.Router();

// CRUD User
router.post('/register',checkRegisterData,user.register);
router.post('/login',checkLoginData, user.login);
router.get('/', isLoggedIn, user.getUserData);
router.put('/',isLoggedIn,user.updateUserData);
router.delete('/',isLoggedIn,user.deleteUser);


// Deposit to your buyer account
router.post('/deposit',isLoggedIn, checkDeposit,user.deposit);
// Buy products
router.post('/buy',isLoggedIn, checkBuying,user.buy);
// Reset your deposited money
router.get('/reset',isLoggedIn,user.reset);




export default router ;