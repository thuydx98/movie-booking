import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entities/branch.entity';
import { BranchDto } from 'src/models/branch.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
  ) {}

  async getList(): Promise<BranchDto[]> {
    const branches = await this.branchesRepository.find();

    return branches.map((item) => new BranchDto(item));
  }
}
