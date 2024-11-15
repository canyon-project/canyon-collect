// @ts-nocheck
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetCoverageLogResponseModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  projectID: string;

  @Field(() => String)
  sha: string;

  @Field(() => Number)
  size: number;

  @Field(() => String)
  timing: string;

//   创建、更新时间
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
