// @ts-nocheck
import {Query, Resolver} from "@nestjs/graphql";
import {BuOption} from "./project.model";
import {ProjectService} from "./services/project.service";
import {GetCoverageLogResponseModel} from "./services/get-coverage-log.response.model";

@Resolver(() => "Project")
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
  ) {}


  @Query(() => [BuOption], {
    description: "获取Projects部门选项",
  })
  async getProjectsBuOptions(): Promise<BuOption[]> {
    const a = await this.projectService.getProjectsBuOptions()
    console.log(a)
    return [{
      bu: "a",
      count: 1,
    }]
  }



  @Query(() => [GetCoverageLogResponseModel], {
    description: "获取CoverageLog列表",
  })
  async getCoverageLog(): Promise<GetCoverageLogResponseModel[]> {
    const a = await this.projectService.getCoverageLog()
    // console.log(a)
    return a.map((item) => {
      return {
        id: item.id,
        projectID: item.projectID,
        sha: item.sha,
        size: item.size,
        timing: item.timing,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
      }
    })
  }
}
