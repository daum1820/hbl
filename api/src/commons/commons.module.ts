import { Module } from '@nestjs/common';
import { CommonsController } from './commons.controller';

@Module({
  controllers: [CommonsController]
})
export class CommonsModule {}
