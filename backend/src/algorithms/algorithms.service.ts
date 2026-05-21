import { Injectable } from '@nestjs/common';
import { RoundRobinRequestDto } from './dto/round-robin.dto';

// ─── Interfaces ────────────────────────────────────────────────────────────────

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

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class AlgorithmsService {
  // ── CPU Scheduling ──────────────────────────────────────────────────────────

  simulateProcesos(algorithm: string, data: any) {
    if (algorithm === 'round-robin') return this.simulateRoundRobin(data);
    return { error: `Algoritmo desconocido: ${algorithm}` };
  }

  private simulateRoundRobin(data: RoundRobinRequestDto) {
    if (!data?.processes?.length) return { error: 'No se proporcionaron procesos.' };

    const processes: ProcessInternal[] = data.processes
      .map((p) => ({ ...p, remainingTime: p.burstTime, completionTime: 0, waitingTime: 0, turnaroundTime: 0 }))
      .sort((a, b) => a.arrivalTime - b.arrivalTime);

    const quantum = Number(data.quantum) || 1;
    let time = 0;
    const executionLog: { processId: string; startTime: number; endTime: number }[] = [];
    const readyQueue: ProcessInternal[] = [];
    let i = 0;
    const n = processes.length;
    let completedCount = 0;

    if (processes[0].arrivalTime > time) time = processes[0].arrivalTime;
    while (i < n && processes[i].arrivalTime <= time) readyQueue.push(processes[i++]);

    while (completedCount < n) {
      if (readyQueue.length === 0) {
        if (i < n) {
          time = processes[i].arrivalTime;
          while (i < n && processes[i].arrivalTime <= time) readyQueue.push(processes[i++]);
        }
        continue;
      }
      const cur = readyQueue.shift()!;
      const execTime = Math.min(quantum, cur.remainingTime);
      executionLog.push({ processId: cur.id, startTime: time, endTime: time + execTime });
      time += execTime;
      cur.remainingTime -= execTime;
      while (i < n && processes[i].arrivalTime <= time) readyQueue.push(processes[i++]);
      if (cur.remainingTime > 0) {
        readyQueue.push(cur);
      } else {
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

  // ── Page Replacement ────────────────────────────────────────────────────────

  simulateMemoria(algorithm: string, data: any) {
    if (algorithm === 'fifo')   return this.simulateFIFO(data);
    if (algorithm === 'lru')    return this.simulateLRU(data);
    if (algorithm === 'optimo') return this.simulateOptimo(data);
    if (algorithm === 'clock')  return this.simulateClock(data);
    if (algorithm === 'lfu')    return this.simulateLFU(data);
    return { error: `Algoritmo desconocido: ${algorithm}` };
  }

  private validatePageData(data: any): { pages: number[]; frames: number } | { error: string } {
    if (!data?.pages?.length) return { error: 'No se proporcionó la cadena de referencias.' };
    const frames = Number(data.frames);
    if (!frames || frames < 1) return { error: 'El número de marcos debe ser mayor que 0.' };
    return { pages: (data.pages as number[]).map(Number), frames };
  }

  private simulateFIFO(data: any) {
    const validated = this.validatePageData(data);
    if ('error' in validated) return validated;
    const { pages, frames } = validated;

    const memory: (number | null)[] = Array(frames).fill(null);
    const queue: number[] = [];
    const steps: PageStep[] = [];
    let faults = 0;
    let hits = 0;

    for (const page of pages) {
      if (memory.includes(page)) {
        hits++;
        steps.push({ page, frames: [...memory], fault: false, replaced: null });
      } else {
        faults++;
        let replaced: number | null = null;
        if (queue.length < frames) {
          memory[queue.length] = page;
        } else {
          const oldest = queue.shift()!;
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

  private simulateLRU(data: any) {
    const validated = this.validatePageData(data);
    if ('error' in validated) return validated;
    const { pages, frames } = validated;

    const memory: (number | null)[] = Array(frames).fill(null);
    const recentOrder: number[] = [];
    const steps: PageStep[] = [];
    let faults = 0;
    let hits = 0;

    for (const page of pages) {
      if (memory.includes(page)) {
        hits++;
        const idx = recentOrder.indexOf(page);
        recentOrder.splice(idx, 1);
        recentOrder.push(page);
        steps.push({ page, frames: [...memory], fault: false, replaced: null });
      } else {
        faults++;
        let replaced: number | null = null;
        if (memory.includes(null)) {
          const emptyIdx = memory.indexOf(null);
          memory[emptyIdx] = page;
        } else {
          const lru = recentOrder.shift()!;
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

  private simulateOptimo(data: any) {
    const validated = this.validatePageData(data);
    if ('error' in validated) return validated;
    const { pages, frames } = validated;

    const memory: (number | null)[] = Array(frames).fill(null);
    const steps: PageStep[] = [];
    let faults = 0;
    let hits = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (memory.includes(page)) {
        hits++;
        steps.push({ page, frames: [...memory], fault: false, replaced: null });
      } else {
        faults++;
        let replaced: number | null = null;
        if (memory.includes(null)) {
          const emptyIdx = memory.indexOf(null);
          memory[emptyIdx] = page;
        } else {
          // Find the page whose next use is farthest in the future
          let farthestIdx = -1;
          let farthestDist = -1;
          for (let j = 0; j < frames; j++) {
            const p = memory[j]!;
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

  private simulateClock(data: any) {
    const validated = this.validatePageData(data);
    if ('error' in validated) return validated;
    const { pages, frames } = validated;

    const memory: (number | null)[] = Array(frames).fill(null);
    const refBits: number[] = Array(frames).fill(0);
    let pointer = 0;
    const steps: PageStep[] = [];
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
      } else {
        faults++;
        // Find victim using clock algorithm
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

  private simulateLFU(data: any) {
    const validated = this.validatePageData(data);
    if ('error' in validated) return validated;
    const { pages, frames } = validated;

    const memory: (number | null)[] = Array(frames).fill(null);
    const freq: Map<number, number> = new Map();
    const insertOrder: number[] = []; // for tie-breaking (FIFO)
    const steps: PageStep[] = [];
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
      } else {
        faults++;
        freq.set(page, 1);
        let replaced: number | null = null;
        if (memory.includes(null)) {
          const emptyIdx = memory.indexOf(null);
          memory[emptyIdx] = page;
          insertOrder.push(page);
        } else {
          // Find page with lowest freq; break ties by earliest insertion
          let minFreq = Infinity;
          let victimInsertIdx = Infinity;
          let victimPage: number | null = null;
          for (const p of memory) {
            if (p === null) continue;
            const f = freq.get(p) || 0;
            const order = insertOrder.indexOf(p);
            if (f < minFreq || (f === minFreq && order < victimInsertIdx)) {
              minFreq = f;
              victimInsertIdx = order;
              victimPage = p;
            }
          }
          replaced = victimPage;
          freq.delete(victimPage!);
          const memIdx = memory.indexOf(victimPage);
          memory[memIdx] = page;
          const orderIdx = insertOrder.indexOf(victimPage!);
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

  // ── Disk Scheduling ─────────────────────────────────────────────────────────

  simulateDisco(algorithm: string, data: any) {
    if (algorithm === 'fcfs')   return this.simulateDiskFCFS(data);
    if (algorithm === 'sstf')   return this.simulateDiskSSTF(data);
    if (algorithm === 'scan')   return this.simulateDiskSCAN(data);
    if (algorithm === 'c-scan') return this.simulateDiskCSCAN(data);
    return { error: `Algoritmo desconocido: ${algorithm}` };
  }

  private validateDiskData(data: any): { requests: number[]; head: number } | { error: string } {
    if (!data?.requests?.length) return { error: 'No se proporcionaron solicitudes.' };
    const head = Number(data.head);
    if (isNaN(head)) return { error: 'Posición inicial del cabezal inválida.' };
    return { requests: (data.requests as number[]).map(Number), head };
  }

  private simulateDiskFCFS(data: any) {
    const validated = this.validateDiskData(data);
    if ('error' in validated) return validated;
    const { requests, head } = validated;

    const steps: DiskStep[] = [];
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

  private simulateDiskSSTF(data: any) {
    const validated = this.validateDiskData(data);
    if ('error' in validated) return validated;
    const { requests, head } = validated;

    const remaining = [...requests];
    const steps: DiskStep[] = [];
    let current = head;
    let total = 0;
    const order: number[] = [];

    while (remaining.length > 0) {
      let nearest = remaining.reduce((prev, curr) =>
        Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
      );
      const dist = Math.abs(nearest - current);
      steps.push({ from: current, to: nearest, distance: dist });
      total += dist;
      order.push(nearest);
      remaining.splice(remaining.indexOf(nearest), 1);
      current = nearest;
    }
    return { steps, totalMovement: total, order, initialHead: head };
  }

  private simulateDiskSCAN(data: any) {
    const validated = this.validateDiskData(data);
    if ('error' in validated) return validated;
    const { requests, head } = validated;

    const maxCylinder = Number(data.maxCylinder) || 199;
    const direction = data.direction === 'down' ? 'down' : 'up';

    const sorted = [...requests].sort((a, b) => a - b);
    const steps: DiskStep[] = [];
    let current = head;
    let total = 0;
    const order: number[] = [];

    const higher = sorted.filter((r) => r >= current);
    const lower = sorted.filter((r) => r < current).reverse();

    const traverse = (targets: number[]) => {
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
        // Move to max then come back
        const toMax = Math.abs(maxCylinder - current);
        steps.push({ from: current, to: maxCylinder, distance: toMax });
        total += toMax;
        current = maxCylinder;
        traverse(lower);
      }
    } else {
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

  private simulateDiskCSCAN(data: any) {
    const validated = this.validateDiskData(data);
    if ('error' in validated) return validated;
    const { requests, head } = validated;

    const maxCylinder = Number(data.maxCylinder) || 199;

    const sorted = [...requests].sort((a, b) => a - b);
    const steps: DiskStep[] = [];
    let current = head;
    let total = 0;
    const order: number[] = [];

    const higher = sorted.filter((r) => r >= current);
    const lower = sorted.filter((r) => r < current);

    const traverse = (targets: number[]) => {
      for (const t of targets) {
        const dist = Math.abs(t - current);
        steps.push({ from: current, to: t, distance: dist });
        total += dist;
        order.push(t);
        current = t;
      }
    };

    // Go up first
    traverse(higher);

    if (lower.length > 0) {
      // Jump to max
      const toMax = Math.abs(maxCylinder - current);
      steps.push({ from: current, to: maxCylinder, distance: toMax });
      total += toMax;
      current = maxCylinder;
      // Jump to 0
      steps.push({ from: current, to: 0, distance: maxCylinder });
      total += maxCylinder;
      current = 0;
      // Serve lower requests
      traverse(lower);
    }

    return { steps, totalMovement: total, order, initialHead: head };
  }
}
