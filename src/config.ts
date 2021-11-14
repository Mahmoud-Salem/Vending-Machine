import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT : process.env.PORT,
    SECRET : process.env.SECRET,
    COINS : [5,10,20,50,100]
};

export default config;