"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmsService = void 0;
const common_1 = require("@nestjs/common");
let AlgorithmsService = class AlgorithmsService {
    simulateProcesos(algorithm, data) {
        if (algorithm === 'round-robin')
            return this.simulateRoundRobin(data);
        return { error: `Algoritmo desconocido: ${algorithm}` };
    }
    simulateRoundRobin(data) {
        if (!data?.processes?.length)
            return { error: 'No se proporcionaron procesos.' };
        const processes = data.processes
            .map((p) => ({ ...p, remainingTime: p.burstTime, completionTime: 0, waitingTime: 0, turnaroundTime: 0 }))
            .sort((a, b) => a.arrivalTime - b.arrivalTime);
        const quantum = Number(data.quantum) || 1;
        let time = 0;
        const executionLog = [];
        const readyQueue = [];
        let i = 0;
        const n = processes.length;
        let completedCount = 0;
        if (processes[0].arrivalTime > time)
            time = processes[0].arrivalTime;
        while (i < n && processes[i].arrivalTime <= time)
            readyQueue.push(processes[i++]);
        while (completedCount < n) {
            if (readyQueue.length === 0) {
                if (i < n) {
                    time = processes[i].arrivalTime;
                    while (i < n && processes[i].arrivalTime <= time)
                        readyQueue.push(processes[i++]);
                }
                continue;
            }
            const cur = readyQueue.shift();
            const execTime = Math.min(quantum, cur.remainingTime);
            executionLog.push({ processId: cur.id, startTime: time, endTime: time + execTime });
            time += execTime;
            cur.remainingTime -= execTime;
            while (i < n && processes[i].arrivalTime <= time)
                readyQueue.push(processes[i++]);
            if (cur.remainingTime > 0) {
                readyQueue.push(cur);
            }
            else {
                cur.completionTime = time;
                cur.turnaroundTime = cur.completionTime - cur.arrivalTime;
                cur.waitingTime = cur.turnaroundTime - cur.burstTime;
                completedCount++;
            }
        }
        return {
            executionLog,
            processMetrics: processes,
            averages: {
                waitingTime: processes.reduce((a, p) => a + p.waitingTime, 0) / n,
                turnaroundTime: processes.reduce((a, p) => a + p.turnaroundTime, 0) / n,
            },
        };
    }
    simulateMemoria(algorithm, data) {
        if (algorithm === 'fifo')
            return this.simulateFIFO(data);
        if (algorithm === 'lru')
            return this.simulateLRU(data);
        if (algorithm === 'optimo')
            return this.simulateOptimo(data);
        if (algorithm === 'clock')
            return this.simulateClock(data);
        if (algorithm === 'lfu')
            return this.simulateLFU(data);
        return { error: `Algoritmo desconocido: ${algorithm}` };
    }
    validatePageData(data) {
        if (!data?.pages?.length)
            return { error: 'No se proporcionó la cadena de referencias.' };
        const frames = Number(data.frames);
        if (!frames || frames < 1)
            return { error: 'El número de marcos debe ser mayor que 0.' };
        return { pages: data.pages.map(Number), frames };
    }
    simulateFIFO(data) {
        const validated = this.validatePageData(data);
        if ('error' in validated)
            return validated;
        const { pages, frames } = validated;
        const memory = Array(frames).fill(null);
        const queue = [];
        const steps = [];
        let faults = 0;
        let hits = 0;
        for (const page of pages) {
            if (memory.includes(page)) {
                hits++;
                steps.push({ page, frames: [...memory], fault: false, replaced: null });
            }
            else {
                faults++;
                let replaced = null;
                if (queue.length < frames) {
                    memory[queue.length] = page;
                }
                else {
                    const oldest = queue.shift();
                    replaced = oldest;
                    const idx = memory.indexOf(oldest);
                    memory[idx] = page;
                }
                queue.push(page);
                steps.push({ page, frames: [...memory], fault: true, replaced });
            }
        }
        return { steps, totalFaults: faults, totalHits: hits, totalAccesses: pages.length };
    }
    simulateLRU(data) {
        const validated = this.validatePageData(data);
        if ('error' in validated)
            return validated;
        const { pages, frames } = validated;
        const memory = Array(frames).fill(null);
        const recentOrder = [];
        const steps = [];
        let faults = 0;
        let hits = 0;
        for (const page of pages) {
            if (memory.includes(page)) {
                hits++;
                const idx = recentOrder.indexOf(page);
                recentOrder.splice(idx, 1);
                recentOrder.push(page);
                steps.push({ page, frames: [...memory], fault: false, replaced: null });
            }
            else {
                faults++;
                let replaced = null;
                if (memory.includes(null)) {
                    const emptyIdx = memory.indexOf(null);
                    memory[emptyIdx] = page;
                }
                else {
                    const lru = recentOrder.shift();
                    replaced = lru;
                    const idx = memory.indexOf(lru);
                    memory[idx] = page;
                }
                recentOrder.push(page);
                steps.push({ page, frames: [...memory], fault: true, replaced });
            }
        }
        return { steps, totalFaults: faults, totalHits: hits, totalAccesses: pages.length };
    }
    simulateOptimo(data) {
        const validated = this.validatePageData(data);
        if ('error' in validated)
            return validated;
        const { pages, frames } = validated;
        const memory = Array(frames).fill(null);
        const steps = [];
        let faults = 0;
        let hits = 0;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (memory.includes(page)) {
                hits++;
                steps.push({ page, frames: [...memory], fault: false, replaced: null });
            }
            else {
                faults++;
                let replaced = null;
                if (memory.includes(null)) {
                    const emptyIdx = memory.indexOf(null);
                    memory[emptyIdx] = page;
                }
                else {
                    let farthestIdx = -1;
                    let farthestDist = -1;
                    for (let j = 0; j < frames; j++) {
                        const p = memory[j];
                        const nextUse = pages.slice(i + 1).indexOf(p);
                        const dist = nextUse === -1 ? Infinity : nextUse;
                        if (dist > farthestDist) {
                            farthestDist = dist;
                            farthestIdx = j;
                        }
                    }
                    replaced = memory[farthestIdx];
                    memory[farthestIdx] = page;
                }
                steps.push({ page, frames: [...memory], fault: true, replaced });
            }
        }
        return { steps, totalFaults: faults, totalHits: hits, totalAccesses: pages.length };
    }
    simulateClock(data) {
        const validated = this.validatePageData(data);
        if ('error' in validated)
            return validated;
        const { pages, frames } = validated;
        const memory = Array(frames).fill(null);
        const refBits = Array(frames).fill(0);
        let pointer = 0;
        const steps = [];
        let faults = 0;
        let hits = 0;
        for (const page of pages) {
            const idx = memory.indexOf(page);
            if (idx !== -1) {
                hits++;
                refBits[idx] = 1;
                steps.push({
                    page,
                    frames: [...memory],
                    fault: false,
                    replaced: null,
                    extra: { refBits: [...refBits], pointer },
                });
            }
            else {
                faults++;
                while (refBits[pointer] === 1) {
                    refBits[pointer] = 0;
                    pointer = (pointer + 1) % frames;
                }
                const replaced = memory[pointer];
                memory[pointer] = page;
                refBits[pointer] = 1;
                const victimPointer = pointer;
                pointer = (pointer + 1) % frames;
                steps.push({
                    page,
                    frames: [...memory],
                    fault: true,
                    replaced,
                    extra: { refBits: [...refBits], pointer: victimPointer },
                });
            }
        }
        return { steps, totalFaults: faults, totalHits: hits, totalAccesses: pages.length };
    }
    simulateLFU(data) {
        const validated = this.validatePageData(data);
        if ('error' in validated)
            return validated;
        const { pages, frames } = validated;
        const memory = Array(frames).fill(null);
        const freq = new Map();
        const insertOrder = [];
        const steps = [];
        let faults = 0;
        let hits = 0;
        for (const page of pages) {
            if (memory.includes(page)) {
                hits++;
                freq.set(page, (freq.get(page) || 0) + 1);
                steps.push({
                    page,
                    frames: [...memory],
                    fault: false,
                    replaced: null,
                    extra: { frequencies: Object.fromEntries(freq) },
                });
            }
            else {
                faults++;
                freq.set(page, 1);
                let replaced = null;
                if (memory.includes(null)) {
                    const emptyIdx = memory.indexOf(null);
                    memory[emptyIdx] = page;
                    insertOrder.push(page);
                }
                else {
                    let minFreq = Infinity;
                    let victimInsertIdx = Infinity;
                    let victimPage = null;
                    for (const p of memory) {
                        if (p === null)
                            continue;
                        const f = freq.get(p) || 0;
                        const order = insertOrder.indexOf(p);
                        if (f < minFreq || (f === minFreq && order < victimInsertIdx)) {
                            minFreq = f;
                            victimInsertIdx = order;
                            victimPage = p;
                        }
                    }
                    replaced = victimPage;
                    freq.delete(victimPage);
                    const memIdx = memory.indexOf(victimPage);
                    memory[memIdx] = page;
                    const orderIdx = insertOrder.indexOf(victimPage);
                    insertOrder.splice(orderIdx, 1);
                    insertOrder.push(page);
                }
                steps.push({
                    page,
                    frames: [...memory],
                    fault: true,
                    replaced,
                    extra: { frequencies: Object.fromEntries(freq) },
                });
            }
        }
        return { steps, totalFaults: faults, totalHits: hits, totalAccesses: pages.length };
    }
    simulateDisco(algorithm, data) {
        if (algorithm === 'fcfs')
            return this.simulateDiskFCFS(data);
        if (algorithm === 'sstf')
            return this.simulateDiskSSTF(data);
        if (algorithm === 'scan')
            return this.simulateDiskSCAN(data);
        if (algorithm === 'c-scan')
            return this.simulateDiskCSCAN(data);
        return { error: `Algoritmo desconocido: ${algorithm}` };
    }
    validateDiskData(data) {
        if (!data?.requests?.length)
            return { error: 'No se proporcionaron solicitudes.' };
        const head = Number(data.head);
        if (isNaN(head))
            return { error: 'Posición inicial del cabezal inválida.' };
        return { requests: data.requests.map(Number), head };
    }
    simulateDiskFCFS(data) {
        const validated = this.validateDiskData(data);
        if ('error' in validated)
            return validated;
        const { requests, head } = validated;
        const steps = [];
        let current = head;
        let total = 0;
        for (const req of requests) {
            const dist = Math.abs(req - current);
            steps.push({ from: current, to: req, distance: dist });
            total += dist;
            current = req;
        }
        return { steps, totalMovement: total, order: requests, initialHead: head };
    }
    simulateDiskSSTF(data) {
        const validated = this.validateDiskData(data);
        if ('error' in validated)
            return validated;
        const { requests, head } = validated;
        const remaining = [...requests];
        const steps = [];
        let current = head;
        let total = 0;
        const order = [];
        while (remaining.length > 0) {
            let nearest = remaining.reduce((prev, curr) => Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev);
            const dist = Math.abs(nearest - current);
            steps.push({ from: current, to: nearest, distance: dist });
            total += dist;
            order.push(nearest);
            remaining.splice(remaining.indexOf(nearest), 1);
            current = nearest;
        }
        return { steps, totalMovement: total, order, initialHead: head };
    }
    simulateDiskSCAN(data) {
        const validated = this.validateDiskData(data);
        if ('error' in validated)
            return validated;
        const { requests, head } = validated;
        const maxCylinder = Number(data.maxCylinder) || 199;
        const direction = data.direction === 'down' ? 'down' : 'up';
        const sorted = [...requests].sort((a, b) => a - b);
        const steps = [];
        let current = head;
        let total = 0;
        const order = [];
        const higher = sorted.filter((r) => r >= current);
        const lower = sorted.filter((r) => r < current).reverse();
        const traverse = (targets) => {
            for (const t of targets) {
                const dist = Math.abs(t - current);
                steps.push({ from: current, to: t, distance: dist });
                total += dist;
                order.push(t);
                current = t;
            }
        };
        if (direction === 'up') {
            traverse(higher);
            if (lower.length > 0) {
                const toMax = Math.abs(maxCylinder - current);
                steps.push({ from: current, to: maxCylinder, distance: toMax });
                total += toMax;
                current = maxCylinder;
                traverse(lower);
            }
        }
        else {
            traverse(lower);
            if (higher.length > 0) {
                const toMin = Math.abs(0 - current);
                steps.push({ from: current, to: 0, distance: toMin });
                total += toMin;
                current = 0;
                traverse(higher);
            }
        }
        return { steps, totalMovement: total, order, initialHead: head, direction };
    }
    simulateDiskCSCAN(data) {
        const validated = this.validateDiskData(data);
        if ('error' in validated)
            return validated;
        const { requests, head } = validated;
        const maxCylinder = Number(data.maxCylinder) || 199;
        const sorted = [...requests].sort((a, b) => a - b);
        const steps = [];
        let current = head;
        let total = 0;
        const order = [];
        const higher = sorted.filter((r) => r >= current);
        const lower = sorted.filter((r) => r < current);
        const traverse = (targets) => {
            for (const t of targets) {
                const dist = Math.abs(t - current);
                steps.push({ from: current, to: t, distance: dist });
                total += dist;
                order.push(t);
                current = t;
            }
        };
        traverse(higher);
        if (lower.length > 0) {
            const toMax = Math.abs(maxCylinder - current);
            steps.push({ from: current, to: maxCylinder, distance: toMax });
            total += toMax;
            current = maxCylinder;
            steps.push({ from: current, to: 0, distance: maxCylinder });
            total += maxCylinder;
            current = 0;
            traverse(lower);
        }
        return { steps, totalMovement: total, order, initialHead: head };
    }
};
exports.AlgorithmsService = AlgorithmsService;
exports.AlgorithmsService = AlgorithmsService = __decorate([
    (0, common_1.Injectable)()
], AlgorithmsService);
//# sourceMappingURL=algorithms.service.js.map