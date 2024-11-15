// @ts-nocheck
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
// import { CoverageClientService } from "./services/coverage-client.service";
import {CoverageMapClientDto} from "./dto/coverage-map-client.dto";
import {CoverageClientService} from "../collect/services/coverage-client.service";
import {CoverageMapClientService} from "./services/coverage-map-client.service";
import {CoverageMapService} from "./services/coverage-map.service";
// import { CoverageClientDto } from "./dto/coverage-client.dto";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
// import { CoverageService } from "./services/coverage.service";
// import { PrismaService } from "../prisma/prisma.service";
// import { CoverageReportsService } from "./services/coverage-reports.service";
// import { ConsumerCoverageService } from "./services/core/consumer-coverage.service";
// import {HtmlBody} from "../html-body.decorator";

interface coverageMapClientDto {
  map: string;
  sha: string;
  projectID: string;
}

@Controller()
export class CovController {
  // p
  constructor(
    private coverageMapClientService: CoverageMapClientService,
    private coverageMapService: CoverageMapService,
  ) {

    // this.consumerCoverageService.invoke();
  }

  // 收集覆盖率的map数据
  // 来自pipeline，是整个项目参与babel编译文件的map
  // 参数需要有，map、sha、projectID
  // 合并需要有个校验步骤，校验map的格式是否正确
  @Post("coverage/map/client")
  async coverageClient(
    @Body() coverageMapClientDto: CoverageMapClientDto,
  ): Promise<any> {
    return this.coverageMapClientService.invoke(coverageMapClientDto)
  }

  // 下面是给ui用的接口
  @Get("api/coverage/map")
  async coverageMap(@Query() query): Promise<any> {
    const {projectID, sha, reportID, filepath} = query;
    return this.coverageMapService.invoke(
      {
        projectID,
        sha,
        reportID,
        filepath,
      }
    );
  }
}
