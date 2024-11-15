// @ts-nocheck
import {HttpException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";
import {decompressedData} from "../../../utils/zstd";

@Injectable()
export class CoverageMapService {
  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  async invoke({
                 projectID,
                 sha,
                 reportID,
                 filepath,
               }) {
    // const {sha, projectID} = invoke

    // const covMap = this.prisma.coverageMap.findFirst({
    //   where:{
    //     projectID: projectID,
    //     sha: sha,
    //   }
    // })
    // const covHit = this.prisma.coverageLog.findFirst({
    //   where:{
    //     projectID: projectID,
    //     sha: sha,
    //   }
    // })

    // console.log(projectID, sha)
    // console.log(filepath,sha,projectID)

    const data =await Promise.all([
      this.prisma.coverageMap.findFirst({
        where: {
          projectID: projectID,
          sha: sha,
        }
      }).then((covMap)=>{
        return decompressedData(covMap.map)
      }),
      this.prisma.coverageLog.findFirst({
        where: {
          projectID: projectID,
          sha: sha,
        }
      }).then((covHit)=>{
        return decompressedData(covHit.hit)
      })
    ]).then(([covMap,covHit])=>{
      // console.log(covHit,'covHit')
      // console.log(covMap,'covMap')
      // console.log(res[0])
      return {
        ...JSON.parse(covMap)[filepath],
        ...JSON.parse(covHit)[filepath],
        // covMap:JSON.parse(covMap)[filepath],
        // covHit:JSON.parse(covHit)[filepath]
      }
    }).catch(err=>{
      console.log(err)
      // throw HttpException
      // 抛出出错误，提示获取覆盖率数据失败
      throw new HttpException('获取覆盖率数据失败', 500)
    })

    // Promise.all()
    return {
      [filepath]: {
        ...data,
        path:filepath
      }
    }
  }
}
