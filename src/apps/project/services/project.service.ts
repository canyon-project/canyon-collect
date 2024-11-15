// @ts-nocheck
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";


@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  async getProjectsBuOptions() {
    return {}
  }
  async getCoverageLog() {
    return this.prisma.coverageLog.findMany({
      where:{}
    })
  }
}
