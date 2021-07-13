import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NewEmployee } from './commands';
import { CreateEmployeeDto } from './create-employee.dto';


@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly commandBus: CommandBus  ) {}

  @Post()
  saveEmployeeInfo(@Body() dto: CreateEmployeeDto) {
    console.log("sdsd");
    return this.commandBus.execute(new NewEmployee(dto.name, dto.designation));
  }
}
