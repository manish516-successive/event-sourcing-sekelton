import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { EmployeeJoinedCommandHandler, NewEmployeeCommandHandler} from './commands/handlers'
import { EmployeeService } from '../employee/employee.service'
import { EmployeeProviders } from '../employee/employee.providers';
import { DatabaseModule } from '../database/database.module';
import { EventBusModule } from '../eventBus/event.bus.module';



@Module({
  imports: [CqrsModule, DatabaseModule, EventBusModule],
  controllers: [EmployeeController],
  providers: [NewEmployeeCommandHandler, EmployeeJoinedCommandHandler, EmployeeService,
  ...EmployeeProviders]
})
export class EmployeeModule {}
