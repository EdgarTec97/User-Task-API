interface MessageSetEntry {
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  attributes: number;
  offset: string;
  size: number;
  headers?: never;
}

interface RecordBatchEntry {
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  attributes: number;
  offset: string;
  headers: { [key: string]: Buffer | string | (Buffer | string)[] | undefined };
  size?: never;
}

export interface EachMessagePayload {
  topic: string;
  partition: number;
  message: MessageSetEntry | RecordBatchEntry;
  heartbeat(): Promise<void>;
  pause(): () => void;
}
