import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  home() {
    return { title: 'Home | cv', active: 'home' };
  }

  @Get('resume')
  @Render('resume')
  resume() {
    return { title: 'Resumo | cv', active: 'resumo' };
  }

  @Get('projects')
  @Render('projects')
  projects() {
    return { title: 'Projetos | cv', active: 'projetos' };
  }

  @Get('contact')
  @Render('contact')
  contact() {
    return { title: 'Contato | cv', active: 'contato' };
  }
}
