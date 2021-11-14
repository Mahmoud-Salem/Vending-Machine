import jwt from 'jsonwebtoken';
import config  from '../config';
import prisma from '../database';

// middleware function to be called before each request to authenticate user.
const isLoggedIn = async (req:any, res:any,next:any)=> {
    const token = req.get('token');
    if(!token)
        return res.status(401).json({mesage:'No token provided'});

    jwt.verify(token, config.SECRET, (err:any, decoded:any) => {
        if(err){
            return res.status(401).json({mesage:'Invalid token'});
        }
        else{
            prisma.user.findUnique({where:{id: decoded.id}})
            .then(output => {
                req.body.decoded = output ;
                next();
            }).catch(error=> {
                // tslint:disable-next-line
                console.log(error);
                return res.status(401).json({mesage:'Invalid token'})
        });
        }
    });
}

export default isLoggedIn ;