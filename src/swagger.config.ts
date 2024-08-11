// swagger.config.ts

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export function setupSwagger(app: INestApplication) {
  const configV1 = new DocumentBuilder()
    .setTitle('API - Pay v1')
    .setDescription('API Pay 1')
    .setVersion('1.0')
    .addTag('pay')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
      description: 'Enter the JWT token for authentication',
    })
    .build();

  const documentV1 = SwaggerModule.createDocument(app, configV1);
  const themeV1 = new SwaggerTheme();
  const optionsV1 = {
    explorer: true,
    customCss: themeV1.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  SwaggerModule.setup('api-v1', app, documentV1, optionsV1);
}
