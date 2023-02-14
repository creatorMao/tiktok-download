import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { createGuid } from '../Helper/generatorHelper.js'

const getLatestTaskStatus = async () => {
  let sql = `
  select * from TASK_STATUS order by IMP_TIME DESC LIMIT 1
`
  const res = await getRowsBySql(sql, {})
  if (res.length > 0) {
    return res[0]
  }
  return {}
}

const addTaskStatus = async (taskStatus) => {
  let sql = `insert into TASK_STATUS(
    ID,
    TASK_ID,
    PHOTO_COUNT,
    VIDEO_COUNT,
    DOWNLOAD_TIME_COST,
    TOTAL,
    CURRENT,
    PROGRESS,
    PHOTO_FAIL_COUNT,
    VIDEO_FAIL_COUNT,
    FAIL_TOTAL) 
    values(
      $ID,
      $TASK_ID,
      $PHOTO_COUNT,
      $VIDEO_COUNT,
      $DOWNLOAD_TIME_COST,
      $TOTAL,
      $CURRENT,
      $PROGRESS,
      $PHOTO_FAIL_COUNT,
      $VIDEO_FAIL_COUNT,
      $FAIL_TOTAL
    )
    `

  const resRaw = await runSql(sql, {
    $ID: createGuid(),
    $TASK_ID: taskStatus.TASK_ID,
    $PHOTO_COUNT: taskStatus.PHOTO_COUNT,
    $VIDEO_COUNT: taskStatus.VIDEO_COUNT,
    $DOWNLOAD_TIME_COST: taskStatus.DOWNLOAD_TIME_COST,
    $TOTAL: taskStatus.TOTAL,
    $CURRENT: taskStatus.CURRENT,
    $PROGRESS: taskStatus.PROGRESS,
    $PHOTO_FAIL_COUNT: taskStatus.PHOTO_FAIL_COUNT,
    $VIDEO_FAIL_COUNT: taskStatus.VIDEO_FAIL_COUNT,
    $FAIL_TOTAL: taskStatus.FAIL_TOTAL
  });

  return resRaw
}

export {
  getLatestTaskStatus,
  addTaskStatus
}