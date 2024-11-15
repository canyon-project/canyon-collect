// @ts-nocheck
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";
import {IstanbulHitMapSchema} from "../../../zod/istanbul.zod";
import {compressedData} from "../../../utils/zstd";
import {formatReportObject, regularData, resetCoverageData} from "../../../utils/coverage";

@Injectable()
export class CoverageClientService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async invoke(invoke){

    // 1. 检查是否上传map
    const coverageMapCount = await this.prisma.coverageMap.count({
      where:{
        projectID: invoke.projectID,
        sha: invoke.sha
      }
    })

    if (coverageMapCount === 0){
      throw new HttpException('coverage map not found', 400)
    }

    const oldcoverage = typeof invoke.coverage === 'string' ? JSON.parse(invoke.coverage) : invoke.coverage




    // 暂时解决方案，需要解决sourceMap问题
    const {coverage} =await formatReportObject({
      coverage: (regularData(oldcoverage)),
      instrumentCwd: invoke.instrumentCwd,
    })




    const formatCoverage = IstanbulHitMapSchema.parse(coverage)

    // ut_coverage，在基础上扩展，source之类的

    // invoke.coverage
    const formatCoverageStr = JSON.stringify(formatCoverage)
    const size = new TextEncoder().encode(formatCoverageStr).length
    const compressedFormatCoverageStr = await compressedData(formatCoverageStr)
    return this.prisma.coverageLog.create({
      data:{
        projectID: invoke.projectID,
        sha: invoke.sha,
        timing: invoke.timing,
        hit: compressedFormatCoverageStr,
        size:size
      }
    }).then(r=>{
      if (r){
        return {
          id:r.id,
          size: r.size
        }
      } else {
        return {
            id:'',
            size:0
        }
      }
    })

    // return formatCoverage
  }
}
