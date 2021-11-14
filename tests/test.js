import app from '../dist/app.js' ;
import request from 'supertest';

// user register as seller and login and add a product then update the product price.
describe('Seller test', () => {
    var token ;
    var product ;
    it('Seller test', async () => {

        // Register as a seller
        var res = await request(app)
            .post('/api/user/register')
            .send({
                username : 'MahSalem1',
                password : 'MahSalem1',
                role     : "SELLER",
            });
      expect(res.statusCode).toBe(201);
      expect(res.body.user.username).toBe('MahSalem1');
      expect(res.body).toHaveProperty('token');
      token = res.body.token ;

        // Login as a seller
         res = await request(app)
        .post('/api/user/login')
        .send({
            username : 'MahSalem1',
            password : 'MahSalem1',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBe('MahSalem1');
        expect(res.body).toHaveProperty('token');

        // Add a product
        res = await request(app)
        .post('/api/product/')
        .set({'token':token})
        .send({
            name : 'coke',
            cost : 5,
            stock : 5,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.product.name).toBe('coke');
        product = res.body.product.id ;

        // Get the new product 
        res = await request(app)
        .get('/api/product/'+product)
        .set({'token':token})
        expect(res.statusCode).toBe(200);
        expect(res.body.product.name).toBe('coke');

        // Update the new product 
        res = await request(app)
            .put('/api/product/'+product)
            .set({'token':token})
            .send({
                cost : 10
            });
        expect(res.statusCode).toBe(201);

        // Get the updated Product
        res = await request(app)
            .get('/api/product/'+product)
            .set({'token':token})
        expect(res.statusCode).toBe(200);
        expect(res.body.product.cost).toBe(10);
    });
});


describe('Buyer test', () => {
    var token ;
    it('Buyer test', async () => {

        // Register as a buyer
        var res = await request(app)
            .post('/api/user/register')
            .send({
                username : 'MahSalem2',
                password : 'MahSalem2',
                role     : "BUYER",
            });
      expect(res.statusCode).toBe(201);
      expect(res.body.user.username).toBe('MahSalem2');
      expect(res.body).toHaveProperty('token');
      token = res.body.token ;


        // Deposit a Coins
        res = await request(app)
        .post('/api/user/deposit')
        .set({'token':token})
        .send({
            deposit : [1,1,1,1,1],
        });
        expect(res.statusCode).toBe(200);


        // reset coins 
        res = await request(app)
        .get('/api/user/reset')
        .set({'token':token});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('change');

        // get coins 
        res = await request(app)
        .get('/api/user/')
        .set({'token':token});

        expect(res.statusCode).toBe(200);
        expect(res.body.user.deposit).toBe(0);

        // Deposit a Coins
        res = await request(app)
        .post('/api/user/deposit')
        .set({'token':token})
        .send({
            deposit : [1,1,1,1,1],
        });
        expect(res.statusCode).toBe(200);

        // buy coke
        res = await request(app)
        .post('/api/user/buy')
        .set({'token':token})
        .send({
            productId : 1,
            amount : 1
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.product).toBe('coke');
    });
});