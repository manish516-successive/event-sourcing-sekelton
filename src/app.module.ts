import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { EventBusModule } from './eventBus/event.bus.module';



@Module({
  imports: [EventBusModule,EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
