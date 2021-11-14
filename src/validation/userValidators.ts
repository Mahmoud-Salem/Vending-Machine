import  { check, validationResult } from 'express-validator';
import {  Role } from '.prisma/client';

// Validation Data

// check data for registeration.
const checkRegisterData:any[] = [
    check('username')
        .exists().withMessage({message:'Username should be provided'}).bail()
        .isString()
        .isAlphanumeric().withMessage({message:'Username should not contain special characters'}).bail()
        .isLength({min: 4, max: 30}).withMessage({message:'Username should be between 4 and 30 characters'}),

    check('password')
        .exists().withMessage({message: "Password is missing"}).bail()
        .isString()
        .isLength({min: 8, max: 30}).withMessage({message: 'Password should be between 8 and 30 characters'}).bail(),


    check('role')
        .exists().withMessage({message: "Role is missing"}).bail()
        .isString()
        .custom((value:any) => {
            if(Object.values(Role).includes(value) )
                return true ;
            else return false ;
        }).withMessage({message :'Role should be BUYER or SELLER' }),

    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

// check data for login.
const checkLoginData:any[] = [
    check('username')
        .exists().withMessage({message:'Username should be provided'}).bail()
        .isString()
        .isAlphanumeric().withMessage({message:'Username should not contain special characters'}).bail()
        .isLength({min: 4, max: 30}).withMessage({message:'Username should be between 4 and 30 characters'}),

    check('password')
        .exists().withMessage({message: "Password is missing"}).bail()
        .isString()
        .isLength({min: 8, max: 30}).withMessage({message: 'Password should be between 8 and 30 characters'}).bail(),


    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

// check data for update.
const checkUpdateData:any[] = [
    check('username')
        .optional()
        .isString()
        .isAlphanumeric().withMessage({message:'Username should not contain special characters'}).bail()
        .isLength({min: 4, max: 30}).withMessage({message:'Username should be between 4 and 30 characters'}),

    check('password')
        .optional()
        .isString()
        .isLength({min: 8, max: 30}).withMessage({message: 'Password should be between 8 and 30 characters'}).bail(),


    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

// check data for deposit.
const checkDeposit:any[] = [
    check('deposit')
        .exists().withMessage({message: "Deposit array is missing"}).bail()
        .isArray()
        .custom((value:number[]) => {
            if(value.length === 5)
                return true ;
            else return false ;
        }).withMessage({message :'Deposit should be array of length 5' }),


    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

// check data for buying.
const checkBuying:any[] = [
    check('productId')
        .exists().withMessage({message:'ProductId should be provided'}).bail()
        .isNumeric().withMessage({message:'productId should be a number'}).bail(),

    check('amount')
        .exists().withMessage({message:'amount should be provided'}).bail()
        .isNumeric().withMessage({message:'amount should be a number'}).bail(),


    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

export {checkRegisterData, checkLoginData, checkUpdateData, checkDeposit, checkBuying};