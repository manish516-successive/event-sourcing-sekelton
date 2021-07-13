import { Producer, KafkaConsumer } from 'node-rdkafka'
import { CommandBus } from '@nestjs/cqrs';
import { KafkaSettings } from './interface' 
import { EmployeeJoined } from '../../employee/commands';
import * as commands from '../../employee/commands';
import { Logger } from '@nestjs/common'





export class KafkaBroker {
  private readonly logger = new Logger('EventBus');

  constructor(private readonly commandBus: CommandBus,
    private readonly settings: KafkaSettings){}

	async subscribe(): Promise<void> {
    const topicName = this.settings.topic;
    const commandBus = this.commandBus;
    const consumer = new KafkaConsumer({
      'group.id': this.settings.id,
      'metadata.broker.list': this.settings.host,
      },{
      'auto.offset.reset': this.settings.reset
    });
    consumer.connect();
    consumer.on('ready', function() {
      consumer.subscribe([topicName]);
      consumer.consume();
    })
    .on('data', function(data) {
      console.log(data);
      commandBus.execute(new commands[JSON.parse(data.value.toString()).type](...Object.values(JSON.parse(data.value.toString()).data)));
    })
	}

  async publish(event): Promise<void> {
    let stream = Producer.createWriteStream({
      'metadata.broker.list': this.settings.host
    }, {}, {
      topic: this.settings.topic
    });

    let queuedSuccess = stream.write(Buffer.from(JSON.stringify({
      type: event.constructor.name,
      data: event
    })));

    if (queuedSuccess) {
      this.logger.log(`Message is queued successfully`);
    } else {
      this.logger.error(`Failed to send message to kafka Queue`);
    }

    stream.on('error', function (err) {
      console.log(err);
      this.logger.error(`Failed to connect to kafka stream`);
    })
    
  }
}