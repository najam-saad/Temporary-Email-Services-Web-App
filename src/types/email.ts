export interface ImprovMXMessage {
  id: string;
  sender?: {
    address: string;
  };
  from?: string;
  to?: string;
  recipient?: string;
  subject?: string;
  content?: string;
  text?: string;
  date?: string;
  created?: number;
  messageId?: string;
  url?: string;
}

export interface MessagesResponse {
  messages: ImprovMXMessage[];
}

export interface LogsResponse {
  logs: ImprovMXMessage[];
}

export interface APIResponse<T> {
  data: T;
  error?: Error;
} 