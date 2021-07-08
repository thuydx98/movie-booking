import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/constants/app.const';
import { BranchDto } from 'src/models/branch.dto';
import { BranchesService } from 'src/services/branches.service';

@Controller('api/branches')
export class BranchesController {
  constructor(private branchService: BranchesService) {}

  @Get()
  @Public()
  async getList(): Promise<BranchDto[]> {
    return await this.branchService.getList();
  }
}
