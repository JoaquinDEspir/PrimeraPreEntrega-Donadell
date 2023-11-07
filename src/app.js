import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import mongoose from 'mongoose';
import viewRouter from './routes/views.router.js';

const app = express();
console.log("anda inicio");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/views', viewRouter);
app.engine('handlebars', exphbs());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

try{
    await mongoose.connect('mongodb+srv://joaqueen:Donatells0@cluster0.uehidpe.mongodb.net/eccomerce?retryWrites=true&w=majority')
    console.log("db conected");
} catch (error) {
    console.log(error.message);
}

app.listen(8080, () => console.log('Listening on 8080'));

