import { IEvent } from '@nestjs/cqrs';
export class EmployeeJoined implements IEvent {
  constructor(public readonly empId: string) {}
}