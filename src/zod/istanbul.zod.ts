// @ts-nocheck
import { z } from 'zod';

const Range = z.object({
  start: z.object({ line: z.number(), column: z.number() }),
  end: z.object({ line: z.number(), column: z.number() }),
})

const IstanbulHitSchema = z.object({
  s: z.record(z.number()),
  f: z.record(z.number()),
  b: z.record(z.array(z.number()))
});

// map类型的key是文件路径，value是IstanbulDataSchema
export const IstanbulHitMapSchema = z.record(IstanbulHitSchema);

export type IstanbulHitMapType = z.infer<typeof IstanbulHitMapSchema>;


const IstanbulMapSchema = z.object({
  statementMap: z.record(
    Range
  ),
  fnMap: z.record(
    z.object({
      name: z.string(),
      decl: Range,
      loc: Range,
      line: z.number(),
    })
  ),
  branchMap: z.record(
    z.object({
      type: z.string(),
      locations: z.array(
        Range
      ),
      loc: Range,
      line: z.number(),
    })
  ),
});

// map类型的key是文件路径，value是IstanbulDataSchema
export const IstanbulMapMapSchema = z.record(IstanbulMapSchema);

export type IstanbulMapMapType = z.infer<typeof IstanbulMapMapSchema>;
