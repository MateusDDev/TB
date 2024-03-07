export interface ICrud<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
}
