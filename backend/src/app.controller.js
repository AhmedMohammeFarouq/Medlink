import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/database.js';
import env from './config/env.js';
import router from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
export const Bootstrap = async (app, express) => {
  app.use(helmet());

  app.use(cors({
    origin: env.clientUrl,
    credentials: true,
  }));

  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use('/api', router);


  app.use(errorMiddleware);

  await connectDB();
};