import { CronJob } from 'cron'
import { startTask } from './task.js'
import { cronJobTime } from '../Config/config.js'
import { log } from '../Helper/logHelper.js'

const startCronJob = () => {
  log(`正在启动定时任务，当前设置为：【${cronJobTime}】`)
  let job = new CronJob(
    cronJobTime,
    () => {
      startTask(true)
    },
    null,
    true
  );
  log('定时任务启动成功~')
}

export {
  startCronJob
}
