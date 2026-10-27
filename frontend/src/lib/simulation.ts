import type { Region } from "./types";

/**
 * 申请流程模拟：用一个虚构的示例项目带用户走完一遍标准流程。
 * 所有项目名、月份、条件都是虚构的示例，只用来讲流程；真实规则以各校官网为准。
 * 文案只写三地通用或已在 REGION_GUIDES 里写过的规则，不引入新的具体数字。
 */

export type Tone = "good" | "warn";

export interface ChoiceOption {
  label: string;
  tone: Tone;
  feedback: string;
}

export type SimAction =
  | { kind: "choice"; prompt: string; options: ChoiceOption[] }
  | { kind: "checklist"; prompt: string; items: { label: string; detail: string }[] }
  | { kind: "confirm"; prompt: string; button: string; result: string };

export interface SimStep {
  /** 模拟时间线上的月份，纯示意 */
  when: string;
  title: string;
  /** 一句话讲这一步要干什么 */
  goal: string;
  /** 这一步现实里会发生什么 */
  happens: string[];
  action: SimAction;
  /** 常见坑 */
  pitfall: string;
  /** 对应看板节点的下标（STAGES[region]），选项目没有对应节点 */
  stageIndex: number | null;
}

export const SAMPLE_PROGRAM: Record<Region, { school: string; name: string }> = {
  UK: { school: "示例大学（英国）", name: "商业分析硕士 MSc" },
  HK: { school: "示例大学（香港）", name: "商业分析硕士 MSc" },
  SG: { school: "示例大学（新加坡）", name: "商业分析硕士 MSc" },
};

const MATERIAL_ITEMS = [
  { label: "简历 CV", detail: "一页为宜，突出与项目相关的经历" },
  { label: "个人陈述 PS", detail: "说清为什么读这个项目，以及你为什么合适" },
  { label: "推荐信 ×2", detail: "要推荐人自己提交，提前打招呼，别等到截止前" },
  { label: "本科成绩单", detail: "多数学校接受先交电子版" },
  { label: "在读/学位证明", detail: "大四在读的先交在读证明，毕业后再补学位证" },
  { label: "语言成绩", detail: "雅思、托福等，分数要求以项目页为准" },
];

function round1(region: Region): SimStep {
  const extra: Record<Region, string> = {
    UK: "部分项目对需要签证的申请人和不需要的分开定截止日，以需要签证的为准。",
    HK: "有的项目写明滚动审理、招满即止，这类项目越早交越稳。",
    SG: "有的项目设申请窗口，奖学金的截止日可能比申请截止更早。",
  };
  const rolling: Record<Region, string> = {
    UK: "很多商学院分轮截止，早轮名额多、反馈也早；赶不上就别硬赶，材料质量比早交一周重要。",
    HK: "主轮名额相对充足；补录轮要看有没有剩余名额，不是每个项目都有。",
    SG: "窗口内提交即可，但要先看清楚奖学金是否有单独的、更早的截止。",
  };
  return {
    when: "10 月",
    title: "选项目、看截止日",
    goal: "先把项目的截止日期和轮次弄清楚，再倒推你的准备时间。",
    happens: [
      "在学校官网项目页找到「申请截止」，记下每一轮的日期",
      extra[region],
      "把项目加进申途的看板，截止日会自动倒计时",
    ],
    action: {
      kind: "choice",
      prompt: "示例项目有两轮截止（模拟）：第一轮在年底，第二轮在来年春天。你现在是 10 月，会怎么选？",
      options: [
        {
          label: "冲第一轮，材料边写边改",
          tone: "good",
          feedback: `可以。${rolling[region]}`,
        },
        {
          label: "放第二轮，多留时间打磨文书",
          tone: "good",
          feedback: "也可以，前提是你确认第二轮还有名额。把这一轮的日期也记进看板，别被拖过去。",
        },
        {
          label: "先不看日期，准备好了再说",
          tone: "warn",
          feedback: "风险最大：很多人是错过截止日才发现日期。先把日期记下来，再决定节奏。",
        },
      ],
    },
    pitfall: "只看学校主页的笼统日期。要看项目页上、写着具体年份的截止日。",
    stageIndex: null,
  };
}

function prepare(region: Region): SimStep {
  const items = [...MATERIAL_ITEMS];
  items.push(
    region === "UK"
      ? { label: "网申表", detail: "在学校申请系统里填写并上传以上材料" }
      : { label: "网申表 + 申请费", detail: "在学校申请系统里填写、上传材料，并缴申请费" },
  );
  return {
    when: "10–11 月",
    title: "备材料",
    goal: "把清单上的材料一项项备齐，推荐信最容易拖，最先联系。",
    happens: [
      "按项目要求列材料清单，逐项打勾",
      "给两位推荐人发邀请，并告诉他们截止日",
      "文书写完先找人改，再定稿",
    ],
    action: {
      kind: "checklist",
      prompt: "示例清单（模拟）。逐项勾选，全部备好后才能进入下一步：",
      items,
    },
    pitfall: "推荐人没来得及提交，整份申请就卡在「材料不全」。提前一个月联系，截止前一周再确认一次。",
    stageIndex: 0,
  };
}

function submit(region: Region): SimStep {
  const fee = region !== "UK";
  return {
    when: "11–12 月",
    title: "提交网申",
    goal: "在截止日前完成提交，并留好凭证。",
    happens: [
      "登录学校申请系统，核对每一栏信息，再点提交",
      fee ? "提交时缴申请费，保存支付凭证" : "提交后会收到确认邮件和申请编号",
      "提交之后，系统里的状态就是你的「进度条」",
    ],
    action: {
      kind: "confirm",
      prompt: "材料已经备齐。提交前最后核对：姓名拼写与护照一致、项目名选对、轮次选对。",
      button: "确认无误，提交申请",
      result: fee
        ? "提交成功（模拟）。你会收到确认邮件，把申请编号和支付凭证存好；之后每周看一次邮箱（含垃圾箱）。"
        : "提交成功（模拟）。你会收到确认邮件，把申请编号存好；之后每周看一次邮箱（含垃圾箱）。",
    },
    pitfall: "卡着截止日最后一小时提交。系统拥堵或网络出问题时，没有补救的余地。",
    stageIndex: 1,
  };
}

function interview(): SimStep {
  return {
    when: "12 月–次年 1 月",
    title: "面试（有些项目才有）",
    goal: "弄清楚项目有没有面试；有的话按邀请邮件准备。",
    happens: [
      "部分项目会发面试邀请，形式可能是视频面试或录制回答",
      "没有面试的项目，直接等审核结果，这一步跳过",
    ],
    action: {
      kind: "choice",
      prompt: "你收到一封面试邀请邮件（模拟），会怎么处理？",
      options: [
        {
          label: "当天回复确认时间，再准备",
          tone: "good",
          feedback: "对。先确认，再按项目官网对面试形式的说明去准备，并把面试时间记进看板的备注。",
        },
        {
          label: "先放着，晚点再看",
          tone: "warn",
          feedback: "邀请通常有回复期限，拖过了可能被视为放弃。收到先回复。",
        },
      ],
    },
    pitfall: "没把面试邮件和垃圾邮件区分开。申请期间，发件域名是学校的邮件都要看。",
    stageIndex: 2,
  };
}

function offer(region: Region): SimStep {
  const deadlineWord = region === "HK" ? "留位费" : region === "UK" ? "押金" : "押金";
  return {
    when: "次年 1–3 月",
    title: "收到录取",
    goal: "看清录取是有条件还是无条件，以及回复和缴费的期限。",
    happens: [
      "学校发录取通知（Offer）",
      region === "SG"
        ? "看清接受录取的期限和条件"
        : "多数是有条件录取：毕业后还要补交成绩单、学位证、语言成绩等",
      `录取信里会写接受录取和缴${deadlineWord}的期限`,
    ],
    action: {
      kind: "choice",
      prompt: `你收到示例项目的录取通知（模拟）。上面写着需要在规定期限内接受并缴${deadlineWord}。你会？`,
      options: [
        {
          label: `把期限记进看板，对比其他录取后在期限内决定`,
          tone: "good",
          feedback: `对。有多个录取时更要把每个的期限都记下来。${region === "HK" ? "港校的留位费期限往往很短，别错过。" : ""}`,
        },
        {
          label: "不急，等别的学校再说，期限以后再看",
          tone: "warn",
          feedback: "期限过了，名额可能被收回。就算还没想好，也要先知道期限在哪天。",
        },
      ],
    },
    pitfall: "只看到「Congratulations」，没读下面的补交条件和期限。",
    stageIndex: 3,
  };
}

function deposit(region: Region): SimStep {
  const word = region === "HK" ? "留位费" : "押金";
  const how: Record<Region, string> = {
    UK: "部分学校要求交押金才能锁位，押金一般不退，付之前看清退款条款",
    HK: "留位费期限往往很短，付之前看清是否可退",
    SG: "接受录取时常要交押金或入学费，付之前看清是否可退",
  };
  return {
    when: "次年 2–4 月",
    title: `缴${word}、锁定名额`,
    goal: "在期限内缴费，把名额锁住。",
    happens: [how[region], "缴费后保存收据和确认邮件", "在看板里把节点推到这一步，并填上下一个期限"],
    action: {
      kind: "confirm",
      prompt: `你决定去示例项目了。按录取信指引在线缴${word}（模拟）。`,
      button: `确认缴纳${word}`,
      result: `缴费成功（模拟）。保存好收据；接下来的重点是补交录取信上列的条件。`,
    },
    pitfall: `境外支付可能比想象的慢，临近期限才去付，容易付不出去。`,
    stageIndex: 4,
  };
}

function conditions(): SimStep {
  return {
    when: "次年 6–7 月",
    title: "满足录取条件",
    goal: "把录取信上的条件逐条补齐，转为无条件录取。",
    happens: [
      "毕业后补交毕业证、学位证和终版成绩单",
      "语言成绩没达标的，要在期限内补考并提交",
      "学校确认后，录取状态变为无条件",
    ],
    action: {
      kind: "checklist",
      prompt: "示例录取信上的条件（模拟）。逐项补齐后才算转为无条件：",
      items: [
        { label: "毕业证 + 学位证", detail: "毕业后扫描上传，原件按学校要求寄送或到校出示" },
        { label: "终版成绩单", detail: "含最后一学期的成绩" },
        { label: "语言成绩达标", detail: "达到项目页写的要求，以官网为准" },
      ],
    },
    pitfall: "毕业证还没拿到就以为没事。条件有补交期限，要倒推时间。",
    stageIndex: 5,
  };
}

function visa(region: Region): SimStep {
  const content: Record<Region, { title: string; happens: string[]; action: SimAction; pitfall: string }> = {
    UK: {
      title: "拿 CAS、办学生签证",
      happens: [
        "转为无条件录取后，学校发 CAS（录取确认函）",
        "凭 CAS 在线申请英国学生签证",
        "按要求预约、提交材料，等待结果",
      ],
      action: {
        kind: "checklist",
        prompt: "收到 CAS 后先核对信息（模拟），有错要立刻让学校改：",
        items: [
          { label: "姓名拼写与护照一致", detail: "错一个字母都可能影响签证" },
          { label: "课程名称和学制正确", detail: "与录取通知一致" },
          { label: "开学日期正确", detail: "决定你什么时候可以入境" },
        ],
      },
      pitfall: "拿到 CAS 才发现信息有误，再改又要等。收到当天就核对。",
    },
    HK: {
      title: "办入境许可（签证）",
      happens: [
        "按学校指引提交签证材料",
        "学校协助向入境处申请",
        "拿到许可后规划入境和住宿",
      ],
      action: {
        kind: "confirm",
        prompt: "学校通知可以提交签证材料了（模拟）。按指引备好护照、照片等材料。",
        button: "提交签证材料",
        result: "已提交（模拟）。具体材料清单和办理时间以学校通知为准，办理期间别订不能退改的机票。",
      },
      pitfall: "不看学校的签证通知邮件。材料清单和提交期限都在里面。",
    },
    SG: {
      title: "办学生准证",
      happens: [
        "开课前 2–3 个月，在网上申请学生准证",
        "获批后收到 IPA 信（入境批准函）",
        "凭 IPA 信入境，再预约去移民与关卡局办手续",
      ],
      action: {
        kind: "confirm",
        prompt: "到了开课前 2–3 个月的申请时间（模拟）。按移民与关卡局官网指引在线提交学生准证申请。",
        button: "提交学生准证申请",
        result: "已提交（模拟）。获批后你会收到 IPA 信，凭它入境，再预约办理后续手续。",
      },
      pitfall: "开课前一个月才开始办。时间太紧，延误会赶不上开学。",
    },
  };
  const c = content[region];
  return {
    when: "次年 6–8 月",
    title: c.title,
    goal: "办好入境所需的签证或准证，走完最后一步。",
    happens: c.happens,
    action: c.action,
    pitfall: c.pitfall,
    stageIndex: 6,
  };
}

export function buildSteps(region: Region): SimStep[] {
  return [
    round1(region),
    prepare(region),
    submit(region),
    interview(),
    offer(region),
    deposit(region),
    conditions(),
    visa(region),
  ];
}
