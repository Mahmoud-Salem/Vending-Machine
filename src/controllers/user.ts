import prisma from '../database';
import bcrypt from 'bcrypt';
import { User, Role, Product } from '.prisma/client';
import jwt from 'jsonwebtoken';
import config from '../config';

const user = {

    // register a user data and creating a jwt token for a user. using bcrypt for hashing password.
    register: async (req:any,res:any)=>
    {
        const rounds:number = 10 ;
        const passwordHash:string = bcrypt.hashSync(req.body.password, rounds);
        const userData:User = {
            id       : undefined,
            username : req.body.username,
            password : passwordHash,
            role     : req.body.role,
            active   : true,
            deposit  : 0,
        };
        try {
            const newUser:User = await prisma.user.create({data:userData});
            delete newUser.password ;
            delete newUser.active   ;
            const accessToken = jwt.sign(newUser, config.SECRET, { expiresIn: '1d'});
            res.status(201).json({message:'created Successfully', user : newUser, token : accessToken});
        }
        catch(e){
            res.status(400).json({message : 'username is duplicated !!'});
        }
    },

    // login a user and creating a jwt token for a user.
    login: async (req:any,res:any)=>
    {

        try {
            const currentUser:User = await prisma.user.findUnique({where:{username: req.body.username}});
            const pass = bcrypt.compareSync(req.body.password, currentUser.password);
            if(pass === false || currentUser.active === false)
                return res.status(400).json({message : 'Incorrect username or password !!'});

            delete currentUser.password ;
            delete currentUser.active   ;
            const accessToken = jwt.sign(currentUser, config.SECRET, { expiresIn: '1d'});
            res.status(200).json({user:currentUser, token : accessToken});

        }catch(e){
            res.status(400).json({message :  'Incorrect username or password !!'});
        }

    },

    // fetch all user's data using jwt token for authentication.
    getUserData: async (req:any,res:any)=>
    {

        try {
            const currentUser:User = await prisma.user.findUnique({where:{username: req.body.decoded.username}});
            delete currentUser.password ;
            delete currentUser.active ;
            if(currentUser.active === false)
                return res.status(400).json({message : 'Incorrect username or password !!'});
            res.status(200).json({user :currentUser});
        }catch(e){
            res.status(500).json({message : 'username is incorrect !!'});
        }

    },
    // update all user's data using jwt token for authentication.
    updateUserData: async (req:any,res:any)=>
    {
        let passwordHash:string ;
        if(req.body.password)
        {
            const rounds:number = 10 ;
            passwordHash = bcrypt.hashSync(req.body.password, rounds);
        }
        const userData:any = {
            username : (req.body.username)? req.body.username : undefined,
            password : (req.body.password)? passwordHash : undefined,
        };
        try {
            await prisma.user.update({where:{id : req.body.decoded.id} , data:userData});
            res.status(200).json({message:'Updated Successfully'});
        }
        catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }
    },

    // delete user's data. if the user is seller delete all data and products, if the user is buyer just make active to false.
    // both cases refund the user.
    deleteUser: async (req:any,res:any)=>
    {
        try {
            let deposit:User ;
            if(req.body.decoded.role === Role.BUYER)
            {
                deposit = await prisma.user.update({where:{id : req.body.decoded.id} , data:{active : false, deposit : 0}});
            }
            else
            {
                deposit=  await prisma.user.delete({where:{id : req.body.decoded.id}});
            }
            res.status(200).json({message:'Deleted Successfully', returnedMoney : deposit.deposit});
        }
        catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }
    },

    // deposit to the user account. user can put the amount to an array of length 5 where every index is coin value [5,10,20,50,100]
    // and value is the count of these coins.
    deposit: async (req:any,res:any)=>
    {

        if(req.body.decoded.Role === Role.SELLER)
        {
            return res.status(400).json({message : 'You need a buyer account !!'});
        }
        let money:number =0 ;

        for(let i =0 ; i < req.body.deposit.length ;i++)
        {
            money += req.body.deposit[i] * config.COINS[i] ;
        }

        try {
            await prisma.user.update({where:{id : req.body.decoded.id} , data:{deposit : {increment : money} }});
            res.status(200).json({message:'Deposited Successfully'});
        }
        catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }
    },

    /*
    The buy controller handle first to check the buyer current data if he have enough money,
    then if the amount needed is available for the product.
    After that, we make the transaction of taking money from the user and decreasing the stock of the products,
    also, we need to increase the amount of money to the seller data.
    Finally, we need to calculate the remaining amount of money to the buyer to reset it.
    */
    buy: async (req:any,res:any)=>
    {

        if(req.body.decoded.Role === Role.SELLER)
        {
            return res.status(400).json({message : 'You need a buyer account !!'});
        }
        try {
            // get buyer and product data
            const productId:number = parseInt(req.body.productId,10);
            const amount:number  = parseInt(req.body.amount,10);
            const buyer:User = await prisma.user.findUnique({where : {id : req.body.decoded.id}});
            const product:Product = await prisma.product.findUnique({where : {id : productId}});

            // check if the amount of products needed exists and the buyer account has enough money.
            if(!product || product.stock < amount || buyer.deposit < amount * product.cost)
            {
                return res.status(400).json({message : 'This purchase is not valid !!'});
            }
            const newStock:number = product.stock - amount ;
            const totalPrice:number = amount * product.cost ;
            let remainingPrice:number = buyer.deposit - totalPrice ;
            const newDeposit:number = remainingPrice%5 ;

            // updating data for the transaction.
            const [newUser, newProduct, newSeller] = await prisma.$transaction([
                prisma.product.update({ where: {id : productId }, data :{stock :newStock } }),
                prisma.user.update({where : {id : req.body.decoded.id}, data : {deposit : newDeposit } }),
                prisma.user.update({where : {id : product.userId}, data : {deposit : {increment :totalPrice }}})
              ]);

            remainingPrice -= remainingPrice%5 ;
            // calculating the remaining money to available coins.
            const change:number[] = [] ;
            for(let i:number = config.COINS.length -1 ; i >= 0 ; i--)
            {
                const temp:number =  Math.floor(remainingPrice/config.COINS[i]) ;
                change[i] = temp ;
                remainingPrice = remainingPrice% config.COINS[i] ;
            }

            res.status(200).json({message:'Purchased Successfully', product : product.name, change});
        }
        catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }
    },

    // reset money by giving the user his deposit amount from available coins.
    reset: async (req:any,res:any)=>
    {


        try {
            const buyer:User = await prisma.user.findUnique({where : {id : req.body.decoded.id}});
            let remainingPrice:number = buyer.deposit ;
            const newDeposit:number = remainingPrice%5 ;
            const userData:any = {
                deposit : newDeposit,
            };
            await prisma.user.update({where : {id : req.body.decoded.id}, data :userData, });
            remainingPrice -= remainingPrice%5 ;
            const change:number[] = [] ;
            for(let i:number = config.COINS.length -1 ; i >= 0 ; i--)
            {
                const temp:number =  Math.floor(remainingPrice/config.COINS[i]) ;
                change[i] = temp ;
                remainingPrice = remainingPrice% config.COINS[i] ;
            }

            res.status(200).json({message:'Refunded Successfully', change});
        }
        catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }
    },

}
export default user ;