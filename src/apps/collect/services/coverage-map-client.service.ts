import { PrismaService } from "../../../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import {
  IstanbulHitMapSchema,
  IstanbulMapMapSchema,
} from "../../../zod/istanbul.zod";
import { compressedData } from "../../../utils/zstd";
import { formatReportObject } from "../../../utils/coverage";
import { coverageObj } from "../models/coverage.model";
import { resetCoverageDataMap } from "canyon-data2";
import {
  formatCoverageData,
  remapCoverageWithInstrumentCwd,
} from "canyon-data2";
import {
  genSummaryMapByCoverageMap,
  getSummaryByPath,
} from "../../../canyon-data/src";

@Injectable()
export class CoverageMapClientService {
  constructor(private readonly prisma: PrismaService) {}
  async invoke({ sha, projectID, coverage, instrumentCwd, branch }) {
    // 先检查有没有
    const exist = await this.prisma.coverage.findFirst({
      where: {
        sha: sha,
        projectID: projectID,
        covType: "all",
      },
    });

    // TODO 这里要改，需要在存在的时候更新，并且要把initMap更新一下

    if (exist) {
      return {
        id: exist.id,
        projectID: exist.projectID,
        sha: exist.sha,
        exist: true,
      };
    }

    const coverageObject =
      typeof coverage === "string" ? JSON.parse(coverage) : coverage;

    const { coverage: formatedCoverage } = formatReportObject({
      coverage: formatCoverageData(coverageObject),
      instrumentCwd: instrumentCwd,
    });

    const formatCoverageMap = IstanbulMapMapSchema.parse(formatedCoverage);

    const chongzu = resetCoverageDataMap(formatCoverageMap);

    // #region == Step x: 覆盖率回溯，在覆盖率存储之前转换(这里一定要用数据库里的instrumentCwd，因为和map是对应的！！！)
    const inithitMapCWanzhen = await remapCoverageWithInstrumentCwd(
      chongzu,
      instrumentCwd,
    );

    const compressedFormatCoverageStr = await compressedData(formatCoverageMap);
    const inithitStr = await compressedData(
      IstanbulHitMapSchema.parse(inithitMapCWanzhen),
    );

    const summary = genSummaryMapByCoverageMap(
      // await this.testExcludeService.invoke(
      //   queueDataToBeConsumed.projectID,
      //   newCoverage,
      // ),
      inithitMapCWanzhen,
      [],
    );
    const sum: any = getSummaryByPath("", summary);
    const summaryZstd = await compressedData(summary);
    //   ******************************************************
    //   ******************************************************
    //   ******************************************************
    // 准备map数据
    //   ******************************************************
    //   ******************************************************
    //   ******************************************************

    return this.prisma.coverage
      .create({
        data: {
          ...coverageObj,
          branch: branch || "-",
          compareTarget: sha,
          provider: "github",
          buildProvider: "github",
          buildID: "",
          projectID: projectID,
          sha: sha,
          reporter: "canyon",
          reportID: sha,
          covType: "all", //map都是all
          statementsCovered: 0,
          statementsTotal: sum.statements.total,
          //空bytes
          summary: summaryZstd,
          hit: inithitStr,
          map: compressedFormatCoverageStr,
          instrumentCwd: instrumentCwd,
          id: `${projectID}|${sha}|all`,
        },
      })
      .then((r) => {
        return {
          id: r.id,
          projectID: r.projectID,
          sha: r.sha,
          exist: false,
        };
      });
  }
}
