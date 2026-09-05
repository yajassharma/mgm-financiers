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
import { RolesGuard } from './common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
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

  // Stricter limits for public endpoints that trigger emails or create records
  const publicWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // 10 requests per 15 min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, status: 'error', title: 'Rate Limited', message: 'Too many requests. Please try again later.' },
  });

  const trackingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, status: 'error', title: 'Rate Limited', message: 'Too many tracking requests. Please try again later.' },
  });

  // Auth endpoint rate limiting (prevent brute-force and email spam)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, status: 'error', title: 'Rate Limited', message: 'Too many authentication attempts. Please try again later.' },
  });

  // Apply strict limits to public write endpoints (grievances, leads, payments)
  app.use('/grievances', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST') return publicWriteLimiter(req, res, next);
    next();
  });
  app.use('/leads', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST') return publicWriteLimiter(req, res, next);
    next();
  });
  app.use('/payments/create-order', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST') return publicWriteLimiter(req, res, next);
    next();
  });

  // Tracking endpoints (read-only but email-triggering)
  app.use('/grievances/track-by-email', trackingLimiter);
  app.use('/payments/track', trackingLimiter);

  // Auth endpoints rate limiting
  app.use('/auth/admin/login', authLimiter);
  app.use('/auth/user/login', authLimiter);
  app.use('/auth/admin/forgot-user', authLimiter);

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

  // 7) Global guards (RolesGuard checks @Roles() decorators, passes through if none set)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  // const redisHost = '127.0.0.1';
  // const pubClient = createClient({ url: `redis://${redisHost}:6379` });
  // const subClient = pubClient.duplicate();

  // await Promise.all([pubClient.connect(), subClient.connect()]);

  // const io = app.getHttpServer().socketServer;
  // io.adapter(createAdapter({ pubClient, subClient }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
