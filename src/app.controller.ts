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
    return { title: 'Resume | cv', active: 'resume' };
  }

  @Get('projects')
  @Render('projects')
  projects() {
    return { title: 'Projects | cv', active: 'projects' };
  }

  @Get('contact')
  @Render('contact')
  contact() {
    return { title: 'Contact | cv', active: 'contact' };
  }
}
