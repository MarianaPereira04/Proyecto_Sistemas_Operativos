export interface ProcessInternal {
    id: string;
    arrivalTime: number;
    burstTime: number;
    remainingTime: number;
    completionTime: number;
    waitingTime: number;
    turnaroundTime: number;
}
export interface PageStep {
    page: number;
    frames: (number | null)[];
    fault: boolean;
    replaced: number | null;
    extra?: Record<string, unknown>;
}
export interface DiskStep {
    from: number;
    to: number;
    distance: number;
}
export declare class AlgorithmsService {
    simulateProcesos(algorithm: string, data: any): {
        error: string;
        executionLog?: undefined;
        processMetrics?: undefined;
        averages?: undefined;
    } | {
        executionLog: {
            processId: string;
            startTime: number;
            endTime: number;
        }[];
        processMetrics: ProcessInternal[];
        averages: {
            waitingTime: number;
            turnaroundTime: number;
        };
        error?: undefined;
    };
    private simulateRoundRobin;
    simulateMemoria(algorithm: string, data: any): {
        error: string;
    } | {
        steps: PageStep[];
        totalFaults: number;
        totalHits: number;
        totalAccesses: number;
    };
    private validatePageData;
    private simulateFIFO;
    private simulateLRU;
    private simulateOptimo;
    private simulateClock;
    private simulateLFU;
    simulateDisco(algorithm: string, data: any): {
        error: string;
    } | {
        steps: DiskStep[];
        totalMovement: number;
        order: number[];
        initialHead: number;
    };
    private validateDiskData;
    private simulateDiskFCFS;
    private simulateDiskSSTF;
    private simulateDiskSCAN;
    private simulateDiskCSCAN;
}
