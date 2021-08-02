export interface KafkaSettings {
  id: string;
  host: string;
  topic: string
  reset?: 'smallest' | 'earliest' | 'beginning' | 'largest' | 'latest' | 'end' | 'error';
}


