// @ts-nocheck
import { Module } from "@nestjs/common";
// import { CoverageClientService } from "./services/coverage-client.service";
import { CovController } from "./cov.controller";
import {PrismaService} from "../../prisma/prisma.service";
import {CoverageMapClientService} from "./services/coverage-map-client.service";
import {PrismaModule} from "../../prisma/prisma.module";
import {CoverageMapService} from "./services/coverage-map.service";

@Module({
  imports: [PrismaModule],
  controllers: [CovController],
  providers: [
    // CoverageReportsServiceesolver,
    PrismaService,
    CoverageMapClientService,
    CoverageMapService,
    // CoverageClientService,
    // CoverageService,
    // ConsumerCoverageService,
    // PullChangeCodeAndInsertDbService,
    // PullFilePathAndInsertDbService,
    // CoveragediskService,
    // TestExcludeService,
    // CoverageReportsService,
    // GetCoverageLogsService,
  ],
})
export class CovModule {}
