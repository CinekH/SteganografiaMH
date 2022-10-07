import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import mailRoutes from './app/routes/mail.routes.js';
import imageRoutes from './app/routes/image.routes.js';
import userRoutes from './app/routes/user.routes.js';

const app = express();

dotenv.config();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES
app.use('/api/users', userRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/image', imageRoutes);

//PORT
const PORT = process.env.PORT || 8080;

global.frontEndUrl = 'http://localhost:3000/';

//MONGODB CONNECTION
mongoose.connect(process.env.CONNECTION_URL, { useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);

