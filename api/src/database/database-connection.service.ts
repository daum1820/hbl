import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConnectionService {
	private readonly mongodbURI: string;

	constructor(private readonly configService: ConfigService) {
		this.mongodbURI = this.configService.get<string>('MONGODB_URI');
	}

	public get = (): string => this.mongodbURI;
}