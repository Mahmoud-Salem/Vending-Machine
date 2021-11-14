// Requiring dependencies
import express from 'express';
import bodyParser from 'body-parser';

// requiring routes
import user from './routes/user';
import product from './routes/product';

// Initializing app
const app = express();

// setup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Using routes
app.use('/api/user',user);
app.use('/api/product',product);

export default app ;