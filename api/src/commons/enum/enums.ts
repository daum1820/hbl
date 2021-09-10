export enum Role {
  User = 'User',
  Moderator = 'Moderator',
  Admin = 'Admin',
}

export enum ActiveStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum ProductTypes {
  Printer = 'Printer',
  Service = 'Service',
}

export enum CategoryTypes {
  Brand = 'Brand',
  Problem = 'Problem',
}

export enum InvoiceStatus {
  Open = 'open',
  Closed = 'closed',
}

export enum DueDate {
  Days10 = '10d',
  Days15 = '15d',
  Days20 = '20d',
  Days30 = '30d',
  Days60 = '60d',
  Days90 = '90d',
}
export enum OrderStatus {
  Open = 'open',
  Closed = 'closed',
  Wip = 'wip',
}