// swagger.config.ts

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export function setupSwagger(app: INestApplication) {
  const configV1 = new DocumentBuilder()
    .setTitle('API - Gestão de Energia v1')
    .setDescription('API para Gestão de Energia - Versão 1')
    .setVersion('1.0')
    .addTag('energia')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
      description: 'Informe o token JWT para autenticação',
    })
    .build();

  const documentV1 = SwaggerModule.createDocument(app, configV1);
  const themeV1 = new SwaggerTheme();
  const optionsV1 = {
    explorer: true,
    customCss: themeV1.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  SwaggerModule.setup('api-v1', app, documentV1, optionsV1);

  const configV2 = new DocumentBuilder()
    .setTitle('API - Gestão de Energia v2')
    .setDescription('API para Gestão de Energia - Versão 2')
    .setVersion('2.0')
    .addTag('energia')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
      description: 'Informe o token JWT para autenticação',
    })
    .build();

  const documentV2 = SwaggerModule.createDocument(app, configV2);
  const themeV2 = new SwaggerTheme();
  const optionsV2 = {
    explorer: true,
    customCss: themeV2.getBuffer(SwaggerThemeNameEnum.CLASSIC),
  };

  SwaggerModule.setup('api-v2', app, documentV2, optionsV2);
}
