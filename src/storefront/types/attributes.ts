/**
 * Base interface representing attribute type
 */
export interface IAttributeTypeBase {
  id: number;
  name: string;
  unit: string | null;
}

export interface IAttributeType extends IAttributeTypeBase {
  is_numeric: boolean;
}

export interface IBaseAttribute<T> {
  id: number;
  value: T;
}

/**
 * Interface representing attribute type together with its possible values
 */
export interface IAttributeTypeWithOptions<T> extends IAttributeTypeBase {
  possible_values: IBaseAttribute<T>[];
}
