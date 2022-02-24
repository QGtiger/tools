type JudgeFun = () => boolean

export type DeviceJudgeType = {
  isWx: JudgeFun,
  isQQ: JudgeFun,
  isPC: JudgeFun,
  isMob: JudgeFun,
  isIos: JudgeFun
}

