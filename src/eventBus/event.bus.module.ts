import { Module, OnModuleInit } from '@nestjs/common';
import { EventBus } from './event.bus'
import { EventBusPublisher } from './event.bus.publisher'
import { EmployeeJoined } from '../employee/commands';
import { CqrsModule } from '@nestjs/cqrs'
import configuration from './event.bus.config';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [CqrsModule,ConfigModule.forRoot({
    load: [configuration],
  })],
  controllers: [],
  providers: [EventBusPublisher, EventBus, EmployeeJoined],
  exports: [EventBusPublisher]
})
export class EventBusModule implements OnModuleInit {
  constructor(private readonly eventBus: EventBus){}

  async onModuleInit() {
    this.eventBus.subscribeToBroker();
  }
}