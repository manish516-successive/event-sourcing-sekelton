import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeJoined } from '../';
import { EventBusPublisher } from '../../../eventBus/event.bus.publisher'; //this is necessary as it overrides the default publisher



@CommandHandler(EmployeeJoined)
export class EmployeeJoinedCommandHandler implements ICommandHandler<EmployeeJoined> {
  constructor(
    private readonly customEventPublisher: EventBusPublisher,
  ) {}

  async execute(command: EmployeeJoined) {
    console.log("sdsd");
    console.log(command);
    console.log("Joining Successfully");
  }
}