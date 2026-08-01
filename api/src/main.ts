// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { NextFunction, Response, Request } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 2) Security middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // turn on & configure later if needed
      referrerPolicy: { policy: 'no-referrer' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(hpp());
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  app.use(
    '/auth/admin/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many login attempts. Please try again later.',
    }),
  );

  // Only send HSTS header in production + HTTPS
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload',
      );
    }
    next();
  });

  // 3) CORS – control via env
  const origins = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);
  app.enableCors({
    origin: origins.length ? origins : false, // avoid `true` in prod
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
  });

  // 4) Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 5) Global interceptors (order matters)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  // 6) Global error filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // const redisHost = '127.0.0.1';
  // const pubClient = createClient({ url: `redis://${redisHost}:6379` });
  // const subClient = pubClient.duplicate();

  // await Promise.all([pubClient.connect(), subClient.connect()]);

  // const io = app.getHttpServer().socketServer;
  // io.adapter(createAdapter({ pubClient, subClient }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
