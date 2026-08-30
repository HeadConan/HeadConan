/**
 * HEADCONAN RUNTIME — 一阶对话（W3.3）
 *
 * 目的（docs/W3_PLAN.md §3 W3.3）：对话是"结构化事件 + 点击目标"。
 *   - 点击目标：conversation 场景内点角色卡片 → 设置对话目标，后续话语定向该角色。
 *   - 场景绑定话语：deriveScene 输出的场景决定建议话语集（conversation→对话 / exploration→探索）。
 *   - 场景内对话状态：scene.inScene.dialogueTurn 递增，随快照持久化，刷新恢复。
 * 纪律：
 *   - 本模块只做"状态记账 + 建议话语"，不写入内核；写入仍由内核 applyEvent 判定（拒绝即事件）。
 *   - 建议话语为演示世界（SPY×FAMILY）内容；引擎与 IP 解耦（docs/VISION.md D-10）。
 */

import type { SceneState, SceneType } from '../representation/types/state';

/** 读取场景内对话轮次（缺省 0） */
export function readDialogueTurn(scene: SceneState): number {
  return typeof scene.inScene.dialogueTurn === 'number' ? scene.inScene.dialogueTurn : 0;
}

/** 记录成功 speech_act 的轮次（W3.3）：递增 scene.inScene.dialogueTurn，返回新场景状态 */
export function recordDialogueTurn(scene: SceneState, turns: number): SceneState {
  if (!Number.isFinite(turns) || turns <= 0) return scene;
  return {
    ...scene,
    inScene: { ...scene.inScene, dialogueTurn: readDialogueTurn(scene) + turns },
  };
}

/** 场景绑定建议话语（W3.3）：conversation→对话 / exploration→探索 / 其余→默认 */
export function suggestedUtterances(scene: SceneType, targetName?: string): string[] {
  if (scene === 'conversation') {
    if (targetName) {
      return [
        `夸奖${targetName}：你真好`,
        `问${targetName}：你最近在忙什么？`,
        `对${targetName}说：今天天气不错`,
      ];
    }
    return ['夸奖约尔：今天的晚餐真棒', '问约尔：你昨晚去哪了？', '问安雅：学校今天怎么样？'];
  }
  if (scene === 'exploration') {
    return ['检查那支黑色钢笔', '前往伊甸学园医务室', '前往伊甸学园走廊'];
  }
  return [
    '问约尔：昨晚去哪了？',
    '夸奖约尔今天很好看',
    '问安雅：学校怎么样？',
    '前往伊甸学园走廊',
    '检查那支黑色钢笔',
  ];
}
