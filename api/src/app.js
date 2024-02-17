import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import './config.js';



import userRoutes from './routes/user.js'; 
import productsRoutes from './routes/products.js'; 
import cartRoutes from './routes/cart.js'; 
import categoriesRoutes from './routes/categories.js'; 
import paymentsRoutes from './routes/payments.js'; 
import ordersRoutes from './routes/orders.js'; 
import adminsRoutes from './routes/admins.js'; 
import inventoryRoutes from './routes/inventory.js'; 
import settingsRoutes from './routes/settings.js'; 

import reviewsRoutes from './routes/reviews.js'; 
import wishlistRoutes from './routes/wishlist.js'; 
import promotionsRoutes from './routes/promotions.js'; 
import bannersRoutes from './routes/banners.js'; 
import staticPagesRoutes from './routes/staticPages.js'; 
import analyticsRoutes from './routes/analytics.js'; 

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  Headers: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}; 

app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.use('/api/user',userRoutes)

app.use('/api/products',productsRoutes)

app.use('/api/cart',cartRoutes)

app.use('/api/categories',categoriesRoutes)

app.use('/api/payments',paymentsRoutes)

app.use('/api/orders',ordersRoutes)

app.use('/api/admins', adminsRoutes)

app.use('/api/inventory', inventoryRoutes)

app.use('/api/settings', settingsRoutes)

app.use('/api/reviews', reviewsRoutes)

app.use('/api/wishlist', wishlistRoutes)

app.use('/api/promotions', promotionsRoutes)

app.use('/api/banners',bannersRoutes)

app.use('/api/static-pages', staticPagesRoutes)

app.use('/api/analytics', analyticsRoutes)













const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting the server:', err);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});
