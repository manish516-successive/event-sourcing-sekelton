import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewEmployee } from '../';
import { EmployeeService } from '../../../employee/employee.service';
import { EventBusPublisher } from '../../../eventBus/event.bus.publisher'; //this is necessary as it overrides the default publisher




@CommandHandler(NewEmployee)
export class NewEmployeeCommandHandler implements ICommandHandler<NewEmployee> {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly customEventPublisher: EventBusPublisher,
  ) {}


  async execute(command: NewEmployee) {
    console.log("New employee Joining");
    const employee = this.customEventPublisher.mergeObjectContext(
      await this.employeeService.create(command),
    );
    employee.addNewEmployee(employee.id);
    employee.commit();
  }
}