import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  home() {
    return { title: 'Home', active: 'home' };
  }

  @Get('resume')
  @Render('resume')
  resume() {
    return { title: 'Resumo', active: 'resumo' };
  }

  @Get('projects')
  @Render('projects')
  projects() {
    return { title: 'Projetos', active: 'projetos' };
  }

  @Get('contact')
  @Render('contact')
  contact() {
    return { title: 'Contato', active: 'contato' };
  }

   @Get('projects/eda-analysis')
  @Render('./projects/eda')
  eda() {
    return { title: 'EDA Analysis', active: 'projetos' };
  }

   @Get('projects/advanced-queries')
  @Render('./projects/tsql')
  tsql() {
    return { title: 'Advanced Queries', active: 'projetos' };
  }

   @Get('projects/query-tuning')
  @Render('./projects/performance')
  performance() {
    return { title: 'Query Tuning', active: 'projetos' };
  }

   @Get('projects/pbi-visuals')
  @Render('./projects/powerbi')
  visuals() {
    return { title: 'Visual with Power BI', active: 'projetos' };
  }
}
