
import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import mongoose from 'mongoose';
import exphbs from 'express-handlebars'; // Importa exphbs, que es el motor de plantillas

const app = express();
console.log("Inicio de la aplicación");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  extname: '.handlebars', 
}));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

try {
  await mongoose.connect('mongodb+srv://joaqueen:Donatells0@cluster0.uehidpe.mongodb.net/eccomerce?retryWrites=true&w=majority')
  console.log("Conexión a la base de datos establecida");
} catch (error) {
  console.log(error.message);
}

app.listen(8080, () => console.log('Escuchando en el puerto 8080'));