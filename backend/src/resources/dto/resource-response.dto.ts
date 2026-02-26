import { ApiProperty } from '@nestjs/swagger';
import { ResourceType, Level } from '@prisma/client';

export class ResourceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: ResourceType })
  type!: ResourceType;

  @ApiProperty({ type: [String] })
  stack!: string[];

  @ApiProperty({ enum: Level })
  level!: Level;

  @ApiProperty()
  isPremium!: boolean;

  @ApiProperty()
  isPublished!: boolean;

  @ApiProperty()
  downloadCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
