export declare class ProcessDto {
    id: string;
    arrivalTime: number;
    burstTime: number;
}
export declare class RoundRobinRequestDto {
    processes: ProcessDto[];
    quantum: number;
}
