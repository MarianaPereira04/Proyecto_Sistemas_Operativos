export class ProcessDto {
  id: string;
  arrivalTime: number;
  burstTime: number;
}

export class RoundRobinRequestDto {
  processes: ProcessDto[];
  quantum: number;
}
