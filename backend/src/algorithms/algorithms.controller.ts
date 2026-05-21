import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AlgorithmsService } from './algorithms.service';

@Controller('algorithms')
export class AlgorithmsController {
  constructor(private readonly algorithmsService: AlgorithmsService) {}

  @Get()
  getStatus() {
    return { status: 'Algorithms API is running' };
  }

  @Post('procesos/:algorithm')
  simulateProcesos(@Param('algorithm') algorithm: string, @Body() data: any) {
    return this.algorithmsService.simulateProcesos(algorithm, data);
  }

  @Post('memoria/:algorithm')
  simulateMemoria(@Param('algorithm') algorithm: string, @Body() data: any) {
    return this.algorithmsService.simulateMemoria(algorithm, data);
  }

  @Post('disco/:algorithm')
  simulateDisco(@Param('algorithm') algorithm: string, @Body() data: any) {
    return this.algorithmsService.simulateDisco(algorithm, data);
  }
}
