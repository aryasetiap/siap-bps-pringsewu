import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Tambahkan global guard (opsional)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
