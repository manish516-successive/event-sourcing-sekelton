import { Injectable } from '@nestjs/common';
import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { EventBus } from "./event.bus"


export interface Constructor<T> {
  new(...args: any[]): T;
}

@Injectable()
export class EventBusPublisher {
  constructor(private readonly eventBus: EventBus) {  }

  mergeObjectContext<T extends AggregateRoot>(object: T): T {
    object.publish = async (event: IEvent) => {
      await this.eventBus.publish(event);
    };
    return object;
  }
}