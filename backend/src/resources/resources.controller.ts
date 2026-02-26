import { Controller, Get, Param, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourceFiltersDto } from './dto/resource-filters.dto';
import { ResourceResponseDto } from './dto/resource-response.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  findAll(@Query() filters: ResourceFiltersDto): Promise<ResourceResponseDto[]> {
    return this.resourcesService.findAll(filters);
  }

  @Get(':slug/content')
  findContent(@Param('slug') slug: string): Promise<string> {
    return this.resourcesService.findContentBySlug(slug);
  }
}
