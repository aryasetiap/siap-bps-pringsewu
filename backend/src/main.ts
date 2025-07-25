import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(path.join(__dirname, 'uploads'), {
    prefix: '/uploads/',
  });

  // Tambahkan global guard (opsional)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  // Pastikan folder uploads/profile ada
  const uploadDir = path.join(__dirname, 'uploads', 'profile');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
