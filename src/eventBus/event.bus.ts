import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { EventStoreBroker, KafkaBroker, RabbitMqBroker } from './brokers'
import { CommandBus } from '@nestjs/cqrs';
import { EventStoreSettings, KafkaSettings, RabbitMqSettings } from './brokers/interface'
import { Logger } from '@nestjs/common'


@Injectable()
export class EventBus {
    private readonly logger = new Logger('EventBus');


  constructor (private readonly commandBus: CommandBus,
    private configService: ConfigService){}

  async subscribeToBroker(): Promise<void> {
    this.logger.log(`Connecting to ${this.configService.get<string>('broker')}`)

    switch(this.configService.get<string>('broker')) {
      case 'event-store':
        let eventStoreObject = new EventStoreBroker(this.commandBus, <EventStoreSettings>this.configService.get<object>('config'));;
        await eventStoreObject.setUpConnection();
        await eventStoreObject.subscribe();        
        break;

      case 'kafka':
        (new KafkaBroker(this.commandBus, <KafkaSettings>this.configService.get<object>('config'))).subscribe();
        break;

      case 'rabbit-mq':
        let rabbitMqObject = new RabbitMqBroker(this.commandBus, <RabbitMqSettings>this.configService.get<object>('config'));
        await rabbitMqObject.setUpConnection();
        await rabbitMqObject.subscribe();
        break;
      default:
       this.logger.error(`${this.configService.get<string>('broker')} is not supported`);
       break;
    }
  }

  

  async publish(event): Promise<void> {
    this.logger.log(`Publishing to ${this.configService.get<string>('broker')}`)


    switch(this.configService.get<string>('broker')) {
      case 'event-store':
        let eventStoreObject = new EventStoreBroker(this.commandBus, <EventStoreSettings>this.configService.get<object>('config'));;
        await eventStoreObject.setUpConnection();
        await eventStoreObject.publish(event);        
        eventStoreObject.closeConnection();
        break;

      case 'kafka':
        (new KafkaBroker(this.commandBus, <KafkaSettings>this.configService.get<object>('config'))).publish(event);
        break;

      case 'rabbit-mq':
        let rabbitMqObject = new RabbitMqBroker(this.commandBus, <RabbitMqSettings>this.configService.get<object>('config'));
        await rabbitMqObject.setUpConnection();
        await rabbitMqObject.publish(event);        
        //rabbitMqObject.closeConnection();
        break;  
      default:
       this.logger.error(`${this.configService.get<string>('broker')} is not supported`);
       break;
    }
  }
}
