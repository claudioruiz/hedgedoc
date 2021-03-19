/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitoringService } from '../../../monitoring/monitoring.service';
import { TokenAuthGuard } from '../../../auth/token-auth.guard';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiProduces,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ServerStatusDto } from '../../../monitoring/server-status.dto';
import {
  forbiddenDescription,
  unauthorizedDescription,
} from '../../utils/descriptions';

@ApiTags('monitoring')
@ApiSecurity('token')
@Controller('monitoring')
export class MonitoringController {
  constructor(private monitoringService: MonitoringService) {}

  @UseGuards(TokenAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'The server info',
    type: ServerStatusDto,
  })
  @ApiUnauthorizedResponse({ description: unauthorizedDescription })
  @ApiForbiddenResponse({ description: forbiddenDescription })
  getStatus(): Promise<ServerStatusDto> {
    // TODO: toServerStatusDto.
    return this.monitoringService.getServerStatus();
  }

  @UseGuards(TokenAuthGuard)
  @Get('prometheus')
  @ApiOkResponse({
    description: 'Prometheus compatible monitoring data',
  })
  @ApiUnauthorizedResponse({ description: unauthorizedDescription })
  @ApiForbiddenResponse({ description: forbiddenDescription })
  @ApiProduces('text/plain')
  getPrometheusStatus(): string {
    return '';
  }
}
