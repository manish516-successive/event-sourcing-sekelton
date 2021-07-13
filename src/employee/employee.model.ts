import { AggregateRoot } from '@nestjs/cqrs';
import { EmployeeJoined } from '../employee/events/employee.joined.event';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IEmployee } from "./employee.interface"

@Entity('Employee')
export class Employee extends AggregateRoot implements IEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  designation: string;


  addNewEmployee(empId) {
    this.apply(new EmployeeJoined(empId));
  }
}