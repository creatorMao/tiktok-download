
import { exec } from 'child_process'

exec('Z:/code/tiktok-download/Lib/ffmpeg.exe -i ' + `Z:/code/tiktok-download/Data/MS4wLjABAAAA_Ed-x8k_MWpvEuQuGarjOLkRTNBoXLhaDfMjZkWUm_3rLPeEjqNKlBfYXBWXhiaY/tos-cn-i-0813c001_8a4cd2324e1f480da00fdbf2ad4955b5.jpeg`, function (err, stdout, stderr) {
  let outStr = stderr.toString();
  console.log(outStr);
  let regDuration = /Duration\: ([0-9\:\.]+),/;
  let rs = regDuration.exec(outStr);
  if (rs[1]) {
    let timeStr = rs[1];
    //获得时长
    console.log(timeStr);
  }
})