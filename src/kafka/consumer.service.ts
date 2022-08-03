import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerSubscribeTopic,
  Kafka,
  ConsumerRunConfig,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private consumers: Consumer[] = [];

  async consume(topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
    const consumer = await this.kafka.consumer({ groupId: 'nestjs-kafka' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
