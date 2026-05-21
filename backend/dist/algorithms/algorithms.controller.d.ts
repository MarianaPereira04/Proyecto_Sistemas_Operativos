import { AlgorithmsService } from './algorithms.service';
export declare class AlgorithmsController {
    private readonly algorithmsService;
    constructor(algorithmsService: AlgorithmsService);
    getStatus(): {
        status: string;
    };
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
        processMetrics: import("./algorithms.service").ProcessInternal[];
        averages: {
            waitingTime: number;
            turnaroundTime: number;
        };
        error?: undefined;
    };
    simulateMemoria(algorithm: string, data: any): {
        error: string;
    } | {
        steps: import("./algorithms.service").PageStep[];
        totalFaults: number;
        totalHits: number;
        totalAccesses: number;
    };
    simulateDisco(algorithm: string, data: any): {
        error: string;
    } | {
        steps: import("./algorithms.service").DiskStep[];
        totalMovement: number;
        order: number[];
        initialHead: number;
    };
}
