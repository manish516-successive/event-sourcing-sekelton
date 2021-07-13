import { CommandBus } from '@nestjs/cqrs';
import { RabbitMqSettings } from './interface' 
import * as commands from '../../employee/commands';
import { Connection, Message, Queue } from "amqp-ts";



export class RabbitMqBroker {
  private connection: Connection;
  private queue: Queue;

  constructor(private readonly commandBus: CommandBus,
    private readonly settings: RabbitMqSettings){}

  async setUpConnection(): Promise<void> {
    this.connection = new Connection(this.settings.url);
    this.queue = await this.connection.declareQueue(this.settings.queue);
    await this.queue.bind(await this.connection.declareExchange(this.settings.exchange));
  }

	async subscribe(): Promise<void> {
    await this.queue.activateConsumer((message: Message) => {
      message.ack();
      this.commandBus.execute(new commands[message.getContent().type](...Object.values(message.getContent().data)));
    }, {noAck: true});

	}

  async publish(event): Promise<void> {
    await this.queue.send(new Message({
      type: event.constructor.name,
      data: event
    }));
  }

  closeConnection(): void{
    this.connection.close();
  }
}