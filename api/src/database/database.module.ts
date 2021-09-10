import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConnectionService } from './database-connection.service';

@Module({
	imports: [ConfigModule],
	providers: [DatabaseConnectionService],
	exports: [DatabaseConnectionService],
})
export class DatabaseModule {}