import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  
  @Get()
  @Render('index')
  getMainPage() {
    return { title: 'Home | Programming Portfolio' };
  }

  @Get('resume')
  @Render('resume')
  getResumePage() {
    return { title: 'Resume | Programming Portfolio' };
  }

  @Get('projects')
  @Render('projects')
  getProjectsPage() {
    return { title: 'Projects | Programming Portfolio' };
  }

  @Get('contact')
  @Render('contact')
  getContactPage() {
    return { title: 'Contact | Programming Portfolio' };
  }
}