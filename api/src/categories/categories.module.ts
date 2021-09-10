import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from './categories.schema';
import { autoIncrementFactory } from '../database/database.utils';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Categories.name,
        useFactory: autoIncrementFactory(CategoriesSchema, '_id'),
        inject: [getConnectionToken()],
      }
    ])
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
