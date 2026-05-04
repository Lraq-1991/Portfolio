import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { HelperOptions } from 'handlebars';
import hbs from 'hbs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const viewsDir = join(process.cwd(), 'views');
  const partialsDir = join(viewsDir, 'partials');
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');
  // hbs default rename turns hyphens into underscores; keep filenames as partial names (shell-start, etc.)
  // Call as a method on `hbs` (never assign to a variable and invoke — that drops `this` and breaks handlebars).
  await new Promise<void>((resolve, reject) => {
    (
      hbs as unknown as {
        registerPartials(
          dir: string,
          opts: { rename: (name: string) => string },
          done: (err?: Error) => void,
        ): void;
      }
    ).registerPartials(partialsDir, { rename: (name: string) => name }, (err?: Error) => {
      if (err) reject(err);
      else resolve();
    });
  });
  hbs.registerHelper('eq', function (this: unknown, a: unknown, b: unknown, options: HelperOptions) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
