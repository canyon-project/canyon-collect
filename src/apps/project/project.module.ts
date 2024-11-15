// @ts-nocheck
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./services/project.service";
import {CoverageClientService} from "../collect/services/coverage-client.service";

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    ProjectResolver,
    ProjectService,
    CoverageClientService
  ],
  exports: [],
})
export class ProjectModule {}
