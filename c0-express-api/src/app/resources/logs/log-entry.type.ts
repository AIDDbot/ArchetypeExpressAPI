export type LogEntry = {
  id: string;
  level: string;
  message: string;
  context: string;
  timestamp: number;
  source: string;
  ip: string;
};
