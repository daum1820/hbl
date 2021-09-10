import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFieldsDto, BaseQueryDto } from '../base/base.dto';
import { buildFilter } from '../utils';
import { CategoryTypes } from '../commons/enum/enums';
import { initialData } from '../database/database.utils';
import { CategoriesDto } from './categories.dto';
import { Categories, CategoriesDocument } from './categories.schema';

const defaultCategories = [
  new Categories('Enroscando Papel', CategoryTypes.Problem),
  new Categories('Não Imprime', CategoryTypes.Problem),
  new Categories('Impressão Sem Qualidade', CategoryTypes.Problem),
  new Categories('Configurações Gerais', CategoryTypes.Problem),
  new Categories('Manchando Impressão', CategoryTypes.Problem),
  new Categories('Instalar Scanner', CategoryTypes.Problem),
  new Categories('Troca do Cilindro', CategoryTypes.Problem),
  new Categories('Riscos', CategoryTypes.Problem),
  new Categories('Equipamento Parado', CategoryTypes.Problem),
  new Categories('Atolando Papel', CategoryTypes.Problem),
  new Categories('Toner Não Encaixa', CategoryTypes.Problem),
  new Categories('Puxando Várias Folhas', CategoryTypes.Problem),
  new Categories('Configurar Impressora', CategoryTypes.Problem),
  new Categories('Reinstalação Do Equipamento', CategoryTypes.Problem),
  new Categories('Duplicando Cópias', CategoryTypes.Problem),
  new Categories('Grudou Etiqueta', CategoryTypes.Problem),
  new Categories('Sujando Impressão', CategoryTypes.Problem),
  new Categories('Barulho', CategoryTypes.Problem),
  new Categories('Impressão Falhada', CategoryTypes.Problem),
  new Categories('Manutenção Preventiva', CategoryTypes.Problem),
  new Categories('Cheirando Queimado', CategoryTypes.Problem),
  new Categories('Cópia Clara', CategoryTypes.Problem),
  new Categories('Cópia Escura', CategoryTypes.Problem),
  new Categories('Papel Enroscado', CategoryTypes.Problem),
  new Categories('Não Faz Frente Verso no Automático', CategoryTypes.Problem),
  new Categories('Atualizar Fireware', CategoryTypes.Problem),
  new Categories('Gaveta Não Fecha', CategoryTypes.Problem),
  new Categories('Limpeza do Cilindro', CategoryTypes.Problem),
  new Categories('Falhas na Impressão', CategoryTypes.Problem),
  new Categories('Mancha Clara', CategoryTypes.Problem),
  new Categories('Troca da Belt', CategoryTypes.Problem),
  new Categories('Impressão Escura', CategoryTypes.Problem),
  new Categories('Impressão Torta', CategoryTypes.Problem),
  new Categories('Impressão Clara', CategoryTypes.Problem),
  new Categories('Marcas na Impressão', CategoryTypes.Problem),
  new Categories('Não Alimenta o Toner', CategoryTypes.Problem),
  new Categories('Não Reconhece Toner', CategoryTypes.Problem),
  new Categories('Não Puxa Papel', CategoryTypes.Problem),
  new Categories('Calibração', CategoryTypes.Problem),
  new Categories('Não Faz Cópia', CategoryTypes.Problem),
  new Categories('Não Puxa Papel Pelo Alimentador', CategoryTypes.Problem),
  new Categories('Amassando Papel', CategoryTypes.Problem),
  new Categories('Cópia Cheia de Falhas', CategoryTypes.Problem),
  new Categories('Painel Não Funciona', CategoryTypes.Problem),
  new Categories('Mensagem de Erro', CategoryTypes.Problem),
  new Categories('Troca de Peças', CategoryTypes.Problem),
  new Categories('Troca do Chip', CategoryTypes.Problem),
  new Categories('Não Funciona o Scanner', CategoryTypes.Problem),
  new Categories('Cópia Sem Qualidade', CategoryTypes.Problem),
  new Categories('Mancha Preta', CategoryTypes.Problem),
  new Categories('Faixa Preta', CategoryTypes.Problem),
  new Categories('Não Liga', CategoryTypes.Problem),
  new Categories('Vazando Toner', CategoryTypes.Problem),
  new Categories('Devolução do Equipamento', CategoryTypes.Problem),
  new Categories('Impressão Tremida', CategoryTypes.Problem),
  new Categories('Instalação do Equipamento', CategoryTypes.Problem),
  new Categories('Retirada do Dquipamento', CategoryTypes.Problem),
  new Categories('Equipamento Queimado', CategoryTypes.Problem),
  new Categories('Brother', CategoryTypes.Brand),
  new Categories('Konica Minolta', CategoryTypes.Brand),
  new Categories('Cannon', CategoryTypes.Brand),
];

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  fields: BaseFieldsDto[] = [
    {fieldName: '_id', fieldType : 'number'},
    {fieldName: 'type', fieldType : 'string'},
    {fieldName: 'name', fieldType : 'string'}
  ];

  constructor(@InjectModel(Categories.name) private readonly model: Model<CategoriesDocument>) {
    initialData(model, defaultCategories, Categories.name, this.logger);
  }

  async create(newCategory: CategoriesDto): Promise<CategoriesDocument> {
    const createdCategory = new this.model(newCategory);
    return createdCategory.save();
  }

  async update(id: string, category: Partial<CategoriesDto>): Promise<CategoriesDocument> {
    return this.model.findByIdAndUpdate(id, category).exec();
  }

  async findAll(filter: BaseQueryDto = {}, limit: number = 5, pageNumber: number = 0, sort: any = { _id: 'asc'}): Promise<CategoriesDocument[]> {
    return this.model.find(buildFilter(filter, this.fields))
      .limit(Number(limit))
      .skip(Number(pageNumber) * Number(limit))
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .exec();
  }

  async findOne(filter: any): Promise<CategoriesDocument> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<CategoriesDocument> {
    return this.model.findById(id).exec();
  }
  
  async deleteById(id: string): Promise<CategoriesDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async count(filter: BaseQueryDto = {}): Promise<number> {
    return this.model.count(buildFilter(filter, this.fields)).exec();
  }
}
