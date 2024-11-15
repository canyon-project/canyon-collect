## 关键流程

1. canyon collect收集到数据以后，直接存本地待消费
2. 本地小合并，未formart的数据
2. 消费到的时候，拉取map（含sourceMap文件），+format
