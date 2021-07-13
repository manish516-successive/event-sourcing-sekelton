import { Connection, Repository } from 'typeorm';
import { Employee } from './employee.model';

export const EmployeeProviders = [
  {
    provide: 'Employee_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Employee),
    inject: ['DATABASE_CONNECTION'],
  },
];
