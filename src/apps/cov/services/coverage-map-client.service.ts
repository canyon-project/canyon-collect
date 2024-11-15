// @ts-nocheck
import {PrismaService} from "../../../prisma/prisma.service";
import {Injectable} from "@nestjs/common";
import {IstanbulHitMapSchema, IstanbulMapMapSchema} from "../../../zod/istanbul.zod";
import {compressedData} from "../../../utils/zstd";
import {formatReportObject, regularData, resetCoverageData} from "../../../utils/coverage";

@Injectable()
export class CoverageMapClientService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async invoke(invoke){
    const {sha,projectID} = invoke



    const oldcoverage = typeof invoke.coverage === 'string' ? JSON.parse(invoke.coverage) : invoke.coverage


    const {coverage} =await formatReportObject({
      coverage: resetCoverageData(regularData(oldcoverage)),
      instrumentCwd: invoke.instrumentCwd,
    })

    const formatCoverageMap = IstanbulMapMapSchema.parse(coverage)

    // invoke.coverage
    const formatCoverageStr = JSON.stringify(formatCoverageMap)
    // const size = new TextEncoder().encode(formatCoverageStr).length
    const compressedFormatCoverageStr = await compressedData(formatCoverageStr)


    await this.prisma.coverageMap.deleteMany({
      where:{
        projectID: projectID,
        sha: sha,
      }
    })

    return this.prisma.coverageMap.create({
      data:{
        projectID: projectID,
        sha: sha,
        map: compressedFormatCoverageStr
      }
    }).then(res=>{
      return {
        id:res.id,
        projectID:res.projectID,
        sha:res.sha
      }
    })
  }
}
