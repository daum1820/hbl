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
  Days7 = '7d',
  Days10 = '10d',
  Days15 = '15d',
  Days20 = '20d',
  Days30 = '30d',
  Days45 = '45d',
}

export enum OrderStatus {
  Empty = 'empty',
  Open = 'open',
  Pending = 'pending',
  Wip = 'wip',
  Closed = 'closed',
}

export enum OrderItemStatus {
  Open = 'open',
  Closed = 'closed',
  Wip = 'wip',
  Approve = 'approve',
}