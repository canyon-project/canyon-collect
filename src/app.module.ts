// @ts-nocheck
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CollectModule } from './apps/collect/collect.module';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProjectModule } from './apps/project/project.module';
// import { AppResolver } from './app.resolver';
import { CovModule } from './apps/cov/cov.module';
// mode：collect、frontAndBack

// 总的模块
const importModules = [];

// 前后端服务的模块
const frontAndBackModules = [ProjectModule, CovModule];

// const runMode = process.env.runMode;

importModules.push(CollectModule);
importModules.push(...frontAndBackModules);

@Module({
  imports: [
    PrismaModule,
    ...importModules,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/graphql/(.*)'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
