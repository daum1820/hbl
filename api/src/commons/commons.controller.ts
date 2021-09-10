import { Controller, Get, Logger } from '@nestjs/common';
import { ActiveStatus, CategoryTypes, DueDate, InvoiceStatus, OrderStatus, ProductTypes, Role } from './enum/enums';
import { IType } from './interfaces/interfaces';

@Controller('commons')
export class CommonsController {
  private readonly logger = new Logger(CommonsController.name);

  @Get('roles')
  async getRoles(): Promise<IType[]> {
    this.logger.log(`> getRoles`);
    
    const roles: IType[] = Object.keys(Role).map(r => ({ label: `label.role.${r.toLowerCase()}`, icon: `icon.role.${r.toLowerCase()}`, value: r }));

    this.logger.log(`< getRoles ${JSON.stringify(roles)}`);

    return roles;
  }

  @Get('categoryTypes')
  async getCategoryTypes(): Promise<IType[]> {
    this.logger.log(`> getCategoryTypes`);
    
    const status: IType[] = Object.keys(CategoryTypes).map(r => ({ label: `label.category.type.${r.toLowerCase()}`, icon: `icon.category.type.${r.toLowerCase()}`, value: r }));

    this.logger.log(`< getCategoryTypes ${JSON.stringify(status)}`);
    return status;
  }

  @Get('productTypes')
  async getProductTypes(): Promise<IType[]> {
    this.logger.log(`> getProductTypes`);
    
    const status: IType[] = Object.keys(ProductTypes).map(r => ({ label: `label.product.type.${r.toLowerCase()}`, icon: `icon.product.type.${r.toLowerCase()}`, value: r }));

    this.logger.log(`< getProductTypes ${JSON.stringify(status)}`);
    return status;
  }

  @Get('dueDate')
  async getDueDate(): Promise<IType[]> {
    this.logger.log(`> getDueDate`);
    
    const status: IType[] = Object.keys(DueDate).map(r => ({ label: `label.duedate.${r.toLowerCase()}`, icon: `icon.duedate.${r.toLowerCase()}`, value: DueDate[r] }));

    this.logger.log(`< getDueDate ${JSON.stringify(status)}`);
    return status;
  }
}
