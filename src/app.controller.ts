import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  renderHome() {
    return {};
  }

  @Get('/website-template/view/html/2846')
  @Render('template-2846')
  renderTemplate2846() {
    return {
      wixEditUrl:
        'https://manage.wix.com/edit-template/from-intro?originTemplateId=3e8b1a18-1c30-41cf-87ac-e18816787ea8&editorSessionId=3be2678c-8104-4d2d-b176-48838260aeb1',
      desktopRef:
        'https://image.thum.io/get/width/1440/crop/900/noanimate/https://www.wix.com/website-template/view/html/2846?originUrl=https%3A%2F%2Fwww.wix.com%2Fwebsite%2Ftemplates%3Fcriteria%3DProgramming%2BPortfolio%26sort%3Dtop&tpClick=view_button&esi=3be2678c-8104-4d2d-b176-48838260aeb1',
      mobileRef:
        'https://image.thum.io/get/width/390/crop/844/noanimate/https://www.wix.com/website-template/view/html/2846?originUrl=https%3A%2F%2Fwww.wix.com%2Fwebsite%2Ftemplates%3Fcriteria%3DProgramming%2BPortfolio%26sort%3Dtop&tpClick=view_button&esi=3be2678c-8104-4d2d-b176-48838260aeb1',
      fullRef:
        'https://image.thum.io/get/width/1440/noanimate/https://www.wix.com/website-template/view/html/2846?originUrl=https%3A%2F%2Fwww.wix.com%2Fwebsite%2Ftemplates%3Fcriteria%3DProgramming%2BPortfolio%26sort%3Dtop&tpClick=view_button&esi=3be2678c-8104-4d2d-b176-48838260aeb1',
    };
  }
}
