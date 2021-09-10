import { get, isEmpty } from "lodash";
import { BaseFieldsDto, BaseQueryDto } from "./base/base.dto";

export const reduceModel = (prop: string = '_id'): any => {
  return (curr, next) => {
    curr[next[prop]] = next;
    return curr;
  }
}

export const buildFilter = (filter: BaseQueryDto, fields: BaseFieldsDto[]): any  => {
  const { search, ...rest } = filter;
  
  Object.entries(rest).forEach(([k, v]) => rest[k] = ['null', 'undefined', ''].includes(v) ? null : v);
  
  if (isEmpty(search)) {
    return rest;
  }

  const $query = { $regex: new RegExp(`.*${search}.*`, 'i') };
  
  return  { ...rest, $or: fields.map(f => {
    if (f.fieldType === 'number') {
      if(isNaN(search)) return {};
      return { [f.fieldName]: parseInt(search) };
    } else {
      return { [f.fieldName]: $query }
    }
  }).filter(f => !isEmpty(f))};
}

export const buildArrayFilter = (search: string, fields: BaseFieldsDto[]): any  => (item) => {

  if (isEmpty(search)) {
    return true;
  }

  const regExp = new RegExp(`.*${search}.*`, 'i');

  return fields.some( f => {
    const value = get(item, f.fieldName)
    return regExp.test(value.toString());
  })
}