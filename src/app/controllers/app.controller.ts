import { Controller, Get } from '@nestjs/common';
import { AppVersion } from 'src/app.version';
@Controller()
export class AppController {

  @Get()
  getVersion(): string {
    return `Payments API Version ${AppVersion.Version}`;
  }
}
