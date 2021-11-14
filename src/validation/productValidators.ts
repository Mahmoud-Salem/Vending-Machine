import  { check, validationResult } from 'express-validator';


const checkProductData:any[] = [
    check('name')
        .exists().withMessage({message:'name should be provided'}).bail()
        .isString().withMessage({message:'name should be string'}).bail(),

    check('cost')
        .exists().withMessage({message:'cost should be provided'}).bail()
        .isNumeric().withMessage({message:'cost should be a number'}).bail(),

    check('stock')
        .exists().withMessage({message:'stock should be provided'}).bail()
        .isNumeric().withMessage({message:'stock should be a number'}).bail(),


    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

const checkUpdatedData:any[] = [
    check('name')
        .optional()
        .isString()
        .isAlphanumeric().withMessage({message:'Username should not contain special characters'}).bail(),

    check('cost')
        .optional()
        .isNumeric().withMessage({message:'cost should be a number'}).bail(),

    check('stock')
        .optional()
        .isNumeric().withMessage({message:'stock should be a number'}).bail(),


    (req:any, res:any, next:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
        },
];

export {checkProductData, checkUpdatedData};