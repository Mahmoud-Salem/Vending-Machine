import prisma from '../database';
import { Product } from '.prisma/client';

const product = {

    // get product from parameter id from the product Table .
    getProduct: async (req:any,res:any)=>
    {

        try {
            const currentProduct:Product = await prisma.product.findUnique({where:{id: parseInt(req.params.id,10)}});
            res.status(200).json({product :currentProduct});
        }catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }

    },

    // get products from the product Table  using the skip and take for pagination where each page has 10 products.
    getProducts: async (req:any,res:any)=>
    {
        try {
            const skip:number = (req.params.page)? (parseInt(req.params.page,10) -1)*10 : 0 ;
            const currents:Product[] = await prisma.product.findMany({  skip, take: 10});
            res.status(200).json({products:currents});
        }catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }
    },

    // delete product from product Table, making sure that the loggedin seller is the owner of the product.
    deleteProduct: async (req:any,res:any)=>
    {

        try {
            await prisma.product.deleteMany({where:{userId :req.body.decoded.id, id  : parseInt(req.params.id,10) } });
            res.status(201).json({message:'Deleted Successfully'});
        }catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }

    },

    // add product to the product table.
    addProduct: async (req:any,res:any)=>
    {

        const productData:Product = {
            id     : undefined,
            name   : req.body.name,
            cost   : parseInt(req.body.cost,10),
            stock  : parseInt(req.body.stock,10),
            userId : req.body.decoded.id
        };

        try {
            const newProduct:Product = await prisma.product.create({data:productData});
            res.status(201).json({message:'created Successfully', product : newProduct});
        }
        catch(e){
            // tslint:disable-next-line
            //console.log(e);
            res.status(500).json({message : 'Internal Server Error !!'});
        }

    },

    // update product to the product table, making sure that the loggedin seller is the owner of the product.

    updateProduct: async (req:any,res:any)=>
    {
        if(!req.params.id)
        res.status(400).json({message : 'product id is missing !!'});

        const productData:Product = {
            id   : parseInt(req.params.id,10),
            name : (req.body.name)? req.body.name: undefined,
            cost : (req.body.cost)? parseInt(req.body.cost,10): undefined,
            stock: (req.body.stock)? parseInt(req.body.stock,10): undefined,
            userId : req.body.decoded.id
        };

        try {
            await prisma.product.updateMany({data:productData, where:{id : parseInt(req.params.id,10), userId: req.body.decoded.id}});
            res.status(201).json({message:'Updated Successfully', product : req.params.id});
        }
        catch(e){
            res.status(500).json({message : 'Internal Server Error !!'});
        }

    },

}
export default product ;