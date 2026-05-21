import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlgorithmsModule } from './algorithms/algorithms.module';

@Module({
  imports: [AlgorithmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
