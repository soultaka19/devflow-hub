import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceFiltersDto } from './dto/resource-filters.dto';
import { ResourceResponseDto } from './dto/resource-response.dto';

@Injectable()
export class ResourcesService {
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async findAll(filters: ResourceFiltersDto): Promise<ResourceResponseDto[]> {
    const resources = await this.prisma.resource.findMany({
      where: {
        isPublished: true,
        ...(filters.type !== undefined && { type: filters.type }),
        ...(filters.level !== undefined && { level: filters.level }),
        ...(filters.isPremium !== undefined && { isPremium: filters.isPremium }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return resources.map(({ storagePath: _storagePath, ...rest }) => rest);
  }

  async findContentBySlug(slug: string): Promise<string> {
    const resource = await this.prisma.resource.findFirst({
      where: { slug, isPublished: true },
      select: { storagePath: true },
    });

    if (!resource) {
      throw new NotFoundException(`Resource "${slug}" not found`);
    }

    const { data, error } = await this.supabase.storage
      .from('resources')
      .download(resource.storagePath);

    if (error ?? !data) {
      throw new InternalServerErrorException('Could not fetch resource content');
    }

    return data.text();
  }
}
