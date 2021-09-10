import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectModel(Settings.name) private model: Model<SettingsDocument>) {
  }

  async update(settings: Partial<Settings>): Promise<SettingsDocument> {
    return this.model.findByIdAndUpdate('system', settings).exec();
  }

  async get(): Promise<SettingsDocument> {
    return this.model.findById('system').exec();
  }
}

