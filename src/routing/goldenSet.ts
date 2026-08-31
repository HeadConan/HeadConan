/**
 * HeadConan Routing — Stage A1 golden set (input classification).
 *
 * 60 labelled inputs (30 structured / 30 open-ended, incl. boundary cases).
 * Gate: classification accuracy ≥ 95% on this set; every misclassification
 * is a named test case (its id). Context: SPY × FAMILY slice + general commands.
 *
 * expected: 'user_structured' | 'user_open'
 */

export interface GoldenCase {
  id: string;
  text: string;
  expected: 'user_structured' | 'user_open';
}

export const GOLDEN_SET: GoldenCase[] = [
  /* ---------------- structured: 30 ---------------- */
  { id: 's01', text: 'Ask Yor about last night', expected: 'user_structured' },
  { id: 's02', text: 'Follow Yor', expected: 'user_structured' },
  { id: 's03', text: 'Leave the room', expected: 'user_structured' },
  { id: 's04', text: 'Observe Anya', expected: 'user_structured' },
  { id: 's05', text: 'Inspect the drawer', expected: 'user_structured' },
  { id: 's06', text: 'Search the kitchen', expected: 'user_structured' },
  { id: 's07', text: 'Read the letter', expected: 'user_structured' },
  { id: 's08', text: 'Talk to Yor', expected: 'user_structured' },
  { id: 's09', text: 'Interrogate the Chancellor', expected: 'user_structured' },
  { id: 's10', text: 'Audit the ledger', expected: 'user_structured' },
  { id: 's11', text: 'Drink the tea', expected: 'user_structured' },
  { id: 's12', text: 'Watch the door', expected: 'user_structured' },
  { id: 's13', text: 'Listen at the door', expected: 'user_structured' },
  { id: 's14', text: 'Open the drawer', expected: 'user_structured' },
  { id: 's15', text: 'Take the letter', expected: 'user_structured' },
  { id: 's16', text: 'Give the tea to Yor', expected: 'user_structured' },
  { id: 's17', text: 'Go to Eden Academy', expected: 'user_structured' },
  { id: 's18', text: 'Move to the kitchen', expected: 'user_structured' },
  { id: 's19', text: 'Hide in the hallway', expected: 'user_structured' },
  { id: 's20', text: 'Wait outside', expected: 'user_structured' },
  { id: 's21', text: '检查抽屉', expected: 'user_structured' },
  { id: 's22', text: '跟着约尔', expected: 'user_structured' },
  { id: 's23', text: '离开房间', expected: 'user_structured' },
  { id: 's24', text: '观察阿尼亚', expected: 'user_structured' },
  { id: 's25', text: '质问大臣', expected: 'user_structured' },
  { id: 's26', text: '打开那封信', expected: 'user_structured' },
  { id: 's27', text: '把茶递给约尔', expected: 'user_structured' },
  { id: 's28', text: '去伊甸学院', expected: 'user_structured' },
  { id: 's29', text: '调查市政厅', expected: 'user_structured' },
  { id: 's30', text: '偷走档案', expected: 'user_structured' },

  /* ---------------- open-ended: 30 ---------------- */
  { id: 'o01', text: '她昨晚到底去哪了', expected: 'user_open' },
  { id: 'o02', text: '我觉得 Anya 有点奇怪', expected: 'user_open' },
  { id: 'o03', text: '今天的茶不错', expected: 'user_open' },
  { id: 'o04', text: 'What do you think about Anya?', expected: 'user_open' },
  { id: 'o05', text: '我该不该告诉她', expected: 'user_open' },
  { id: 'o06', text: '你相信 Yor 的话吗', expected: 'user_open' },
  { id: 'o07', text: '如果她真的是杀手呢', expected: 'user_open' },
  { id: 'o08', text: 'I want to talk but I am scared', expected: 'user_open' },
  { id: 'o09', text: '也许我不该追查下去', expected: 'user_open' },
  { id: 'o10', text: 'Anya 是不是知道些什么', expected: 'user_open' },
  { id: 'o11', text: '这房子里有种说不出的感觉', expected: 'user_open' },
  { id: 'o12', text: 'Why does she keep lying?', expected: 'user_open' },
  { id: 'o13', text: '那封信用词很奇怪', expected: 'user_open' },
  { id: 'o14', text: '我觉得有人在监视我们', expected: 'user_open' },
  { id: 'o15', text: 'What would a real family do?', expected: 'user_open' },
  { id: 'o16', text: '她倒茶的手势很专业', expected: 'user_open' },
  { id: 'o17', text: 'I noticed something odd last night', expected: 'user_open' },
  { id: 'o18', text: '孩子们放学后会路过那里', expected: 'user_open' },
  { id: 'o19', text: '也许我应该先睡一觉', expected: 'user_open' },
  { id: 'o20', text: 'Is it safe to trust her?', expected: 'user_open' },
  { id: 'o21', text: '那个影子看起来不像普通人', expected: 'user_open' },
  { id: 'o22', text: '他说话时眼睛在躲闪', expected: 'user_open' },
  { id: 'o23', text: 'What if the drawer was a test?', expected: 'user_open' },
  { id: 'o24', text: '这栋楼晚上总有人进出', expected: 'user_open' },
  { id: 'o25', text: '我不想再隐瞒下去了', expected: 'user_open' },
  { id: 'o26', text: 'She smiled at the wrong moment', expected: 'user_open' },
  { id: 'o27', text: '昨天的对话总让我不安', expected: 'user_open' },
  { id: 'o28', text: 'Why is the tea still warm?', expected: 'user_open' },
  { id: 'o29', text: '有个声音在我脑海里挥之不去', expected: 'user_open' },
  { id: 'o30', text: '你注意到她的手了吗', expected: 'user_open' },
];

/** Distribution sanity guard: must stay balanced (30/30). */
export function assertGoldenBalance(): void {
  const structured = GOLDEN_SET.filter((g) => g.expected === 'user_structured').length;
  const open = GOLDEN_SET.filter((g) => g.expected === 'user_open').length;
  if (structured !== 30 || open !== 30) {
    throw new Error(`golden set unbalanced: structured=${structured} open=${open}`);
  }
}
