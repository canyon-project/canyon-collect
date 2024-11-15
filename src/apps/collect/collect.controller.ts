// @ts-nocheck
import {Body, Controller, Get, Post, UseInterceptors} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CoverageClientService} from "./services/coverage-client.service";
import {CoverageClientDto} from "./dto/coverage-client.dto";
import {NoFilesInterceptor} from "@nestjs/platform-express";

@Controller()
export class CollectController {
  constructor(
    private readonly prisma: PrismaService,
    private coverageClientService: CoverageClientService,
  ) {
  }

  @UseInterceptors(NoFilesInterceptor())
  @Post('coverage/client')
  coverageClient(
    @Body() coverageClientDto: CoverageClientDto,
    // @Body('timing') coverage: any
  ) {
    // console.log(coverageClientDto,coverageClientDto)
    // return {}
    return this.coverageClientService.invoke(coverageClientDto)
  }
}
