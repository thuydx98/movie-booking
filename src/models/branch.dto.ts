import { Branch } from './../entities/branch.entity';

export class BranchDto {
  id: number;
  name: string;
  address: string;

  constructor(entity: Branch) {
    this.id = entity.id;
    this.name = entity.name;
    this.address = entity.address;
  }
}
