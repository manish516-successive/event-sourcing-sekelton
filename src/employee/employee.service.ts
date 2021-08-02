import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './employee.model';
import { CreateEmployeeDto } from './create-employee.dto'



@Injectable()
export class EmployeeService {
  constructor(
    @Inject('Employee_REPOSITORY')
    private EmployeeRepository: Repository<Employee>,
  ) {}

  create(employee: CreateEmployeeDto){
    const employeeOject = this.EmployeeRepository.create(employee);
    return this.EmployeeRepository.save(employeeOject);
  }
}
