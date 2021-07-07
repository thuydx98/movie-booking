import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/constants/app.const';
import { GetListShowTimeDto, ShowTimeDto } from 'src/models/show-time.dto';
import { ShowTimesService } from 'src/services/show-times.service';

@Controller('api/show-times')
export class ShowTimesController {
  constructor(private showTimeService: ShowTimesService) {}

  @Get()
  @Public()
  async getPagingList(
    @Query() params: GetListShowTimeDto,
  ): Promise<ShowTimeDto[]> {
    return await this.showTimeService.getList(params);
  }
}
