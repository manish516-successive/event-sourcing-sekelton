import { createConnection, UserCredentials, expectedVersion, EventData,
  createEventData, } from 'node-eventstore-client'
import { v4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { EventStoreSettings } from './interface' 
import * as commands from '../../employee/commands';



export class EventStoreBroker {
  private connection: any;


  constructor(private readonly commandBus: CommandBus,
    private readonly settings: EventStoreSettings){}

  async setUpConnection(): Promise<void> {
    this.connection = createConnection({}, this.settings.url);
    await this.connection.connect();
  }

	async subscribe(): Promise<void> {
    const subscription = await this.connection.connectToPersistentSubscription(
      this.settings.stream, this.settings.group,
      (subscription, event) => {
        this.commandBus.execute(new commands[event.originalEvent.eventType](...Object.values(JSON.parse(event.originalEvent.data.toString()))));
        return Promise.resolve();
        },
      () => {
        console.log('Dropping the persistent subscription due to error');
      },
      new UserCredentials(this.settings.username, this.settings.password),
    );
	}

  async publish(event): Promise<void> {
    const payload: EventData = createEventData(
      v4(),
      event.constructor.name,
      true,
      Buffer.from(JSON.stringify(event)),
    );
    await this.connection.appendToStream(this.settings.stream, -2 , payload)
  }

  async closeConnection() {
    this.connection.close();
  }
}