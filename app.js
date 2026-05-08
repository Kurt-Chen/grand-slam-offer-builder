const form = document.querySelector("#offerForm");
const scoreValue = document.querySelector("#scoreValue");
const scoreBar = document.querySelector("#scoreBar");
const offerOutput = document.querySelector("#offerOutput");
const stepsOutput = document.querySelector("#stepsOutput");
const diagnosisList = document.querySelector("#diagnosisList");
const scriptOutput = document.querySelector("#scriptOutput");
const offerTitle = document.querySelector("#offerTitle");
const toast = document.querySelector("#toast");
const startupReminder = document.querySelector("#startupReminder");
const closeReminderButton = document.querySelector("#closeReminderButton");
const storageKey = "grand-slam-offer-builder-v3";

const defaults = {
  market: "想把专业能力产品化、但成交率不稳定的顾问和知识创业者",
  painLevel: "8",
  buyingPower: "7",
  reachDifficulty: "4",
  growth: "7",
  dreamOutcome: "在 30 天内设计出一个客户愿意马上行动的高价值报价，并完成第一轮成交验证。",
  beforeProblems: "不知道客户真正愿意为哪个结果付费\n报价听起来像普通服务，容易被比价\n缺少清晰的成交标准",
  duringProblems: "不会把交付拆成可感知的进展\n执行中没人反馈，容易做偏\n客户需要自己摸索太多细节",
  afterProblems: "不会复盘成交对话\n不知道哪些奖金和保证真的提升转化\n报价无法稳定复制到下一轮",
  solutions: "报价诊断访谈\n价值方程重构工作坊\n交付清单和里程碑设计\n成交页文案评审\n销售问答脚本\n第一轮成交复盘",
  attention: "1 对 1",
  effortModel: "Done With You",
  support: "直播工作坊、异步批改、私信答疑",
  cadence: "7 天完成诊断，4 周完成报价和首轮验证",
  coreStack: "1 对 1 报价诊断、报价结构工作坊、成交页文案、三次迭代评审、销售问答脚本",
  trimmed: "把长期陪跑改成三次关键节点评审；把基础教学改成模板和清单。",
  bonuses: "客户痛点访谈清单 - 帮你找出愿意付费的痛点\n奖金命名模板 - 让附加组件听起来更具体\n保证条款检查表 - 降低客户购买风险\n报价页结构示例 - 加快上线速度",
  guarantee: "完成全部作业并参加评审后，如果仍无法形成可测试报价，免费延长一次迭代周期。",
  scarcity: "每月只接 12 个项目",
  urgency: "每月最后一个周五关闭申请",
  offerName: "30 天高成交报价冲刺",
  price: "9800",
  validation: "先访谈 10 个目标客户，向其中 5 个展示报价；如果 2 个以上愿意支付定金，则进入下一轮交付。"
};

const stepGuides = [
  {
    title: "选择值得服务的市场",
    how: [
      "写清楚客户身份、业务阶段、预算范围和正在经历的具体场景。",
      "用四个指标判断：痛苦是否强、是否有购买力、是否容易触达、市场是否在成长。",
      "如果人群太宽，继续缩小到你能直接列出 20 个潜在客户的程度。"
    ],
    check: "能说清楚“谁会立刻需要它、为什么现在需要、在哪里能找到他们”。"
  },
  {
    title: "写出梦寐以求的结果",
    how: [
      "用客户会复述的语言写结果，不要只写你的交付物。",
      "尽量加入时间、金额、数量、效率或转化率，让结果可感知。",
      "确认这个结果对客户足够重要，重要到愿意为更快、更确定的达成路径付费。"
    ],
    check: "这句话可以直接作为销售页标题或销售对话开场。"
  },
  {
    title: "列出所有障碍",
    how: [
      "开始前列出客户为什么不买、不信、不敢开始。",
      "执行中列出客户会卡住、拖延、做错或需要反馈的地方。",
      "完成后列出客户如何复盘、持续、放大或避免反弹。"
    ],
    check: "至少有 6 个具体障碍，并且每个障碍都像客户真实说出来的话。"
  },
  {
    title: "把障碍逐条变成解决方案",
    how: [
      "把每条障碍改写成一个交付、工具、流程或支持动作。",
      "优先选择能提高成功概率的形式：诊断、模板、代做、陪跑、检查、复盘。",
      "把含糊的承诺改成可交付动作，例如“三轮评审”比“持续优化”更有力量。"
    ],
    check: "客户看到方案清单时，会觉得自己的主要担心都被处理了。"
  },
  {
    title: "设计交付载体",
    how: [
      "选择关注度：1 对 1、小组或一对多，决定客户被支持的强度。",
      "选择努力模型：代做、陪跑或自助，决定客户需要付出多少执行成本。",
      "安排支持方式和节奏，让客户在最容易失败的节点得到帮助。"
    ],
    check: "交付既能提高客户成功率，又不会让你用无限时间硬扛。"
  },
  {
    title: "删减并堆叠报价",
    how: [
      "保留最能推动结果、降低风险、提升速度的核心交付。",
      "删掉客户不在乎、成本很高、但对结果影响不大的内容。",
      "把可模板化、可异步化、可小组化的部分降级，保护利润和交付质量。"
    ],
    check: "报价看起来更强、更聚焦，同时交付成本可控。"
  },
  {
    title: "加入奖金、保证、稀缺和紧迫",
    how: [
      "奖金要处理具体异议，而不是为了显得很多随便赠送。",
      "保证要写清客户需要履行的条件，以及未达成时你的补救方式。",
      "稀缺和紧迫必须来自真实限制，例如名额、批次、截止日或交付容量。"
    ],
    check: "客户感觉风险降低、行动理由更清楚，但不会觉得被催逼。"
  },
  {
    title: "命名、定价、验证",
    how: [
      "名称要包含结果、机制、时间或身份变化，让客户一眼知道价值。",
      "价格根据结果价值、替代方案、交付强度和客户预算先定测试价。",
      "验证时观察真实行动：预约、付定金、进入下一步，而不只是口头夸奖。"
    ],
    check: "已经有可拿去真实销售对话里测试的名称、价格和验证计划。"
  }
];

function getData() {
  return Object.fromEntries(new FormData(form).entries());
}

function setData(data) {
  Object.entries({ ...defaults, ...data }).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
  updateOutputs();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitLines(value) {
  return String(value || "")
    .split(/\n|；|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function calculateScore(data) {
  const dream = Number(data.painLevel || 1);
  const likelihood = (Number(data.buyingPower || 1) + Number(data.growth || 1)) / 2;
  const timeDelay = Number(data.reachDifficulty || 1);
  const effort = data.effortModel === "Done For You" ? 2 : data.effortModel === "Done With You" ? 4 : 7;
  const raw = (dream * 5 + likelihood * 4 + (11 - timeDelay) * 3 + (11 - effort) * 3) * 1.25;
  return Math.max(1, Math.min(100, Math.round(raw)));
}

function block(title, body) {
  return `
    <article class="output-block">
      <h3>${escapeHtml(title)}</h3>
      <p>${body}</p>
    </article>
  `;
}

function listHtml(items, fallback) {
  const values = items.length ? items : [fallback];
  return `<ul>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function numberedListHtml(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function buildOffer(data) {
  const problems = [
    ...splitLines(data.beforeProblems),
    ...splitLines(data.duringProblems),
    ...splitLines(data.afterProblems)
  ];
  const solutions = splitLines(data.solutions);
  const bonuses = splitLines(data.bonuses);

  return [
    block("报价名称", `<strong>${escapeHtml(data.offerName || "未命名报价")}</strong>`),
    block("服务对象", escapeHtml(data.market)),
    block("梦寐以求的结果", escapeHtml(data.dreamOutcome)),
    block("客户不想再面对的问题", listHtml(problems, "还需要补充客户开始前、执行中、完成后的障碍。")),
    block("解决方案堆叠", listHtml(solutions, "把每个障碍逐条变成解决方案。")),
    block(
      "交付载体",
      `${escapeHtml(data.attention)} · ${escapeHtml(data.effortModel)} · ${escapeHtml(data.support)} · ${escapeHtml(data.cadence)}`
    ),
    block("最终核心交付", escapeHtml(data.coreStack)),
    block("删减 / 降级内容", escapeHtml(data.trimmed)),
    block("奖金组件", listHtml(bonuses, "加入能移除异议、提高成功概率的奖金。")),
    block("风险逆转", escapeHtml(data.guarantee)),
    block(
      "价格、稀缺、紧迫",
      `价格：${escapeHtml(data.price || "待定")}。稀缺：${escapeHtml(data.scarcity || "未设置")}。紧迫：${escapeHtml(data.urgency || "未设置")}。`
    ),
    block("验证计划", escapeHtml(data.validation))
  ].join("");
}

function stepItem(number, guide, body, output) {
  return `
    <article class="process-item">
      <span>${number}</span>
      <div>
        <h3>${escapeHtml(guide.title)}</h3>
        <p>${escapeHtml(body)}</p>
        <div class="process-guide">
          <h4>怎么做</h4>
          ${numberedListHtml(guide.how)}
          <h4>检查标准</h4>
          <p>${escapeHtml(guide.check)}</p>
        </div>
        <strong>${escapeHtml(output)}</strong>
      </div>
    </article>
  `;
}

function buildSteps(data) {
  return [
    stepItem("01", stepGuides[0], `市场：${data.market || "待填写"}。用痛苦、购买力、触达、成长性判断是否值得进入。`, "产出：一个明确、可触达、愿意付费的人群。"),
    stepItem("02", stepGuides[1], data.dreamOutcome || "待填写", "产出：客户能复述、能衡量、愿意为之付费的结果。"),
    stepItem("03", stepGuides[2], "分别列出开始前、执行中、完成后的所有问题。", "产出：完整问题清单。"),
    stepItem("04", stepGuides[3], data.solutions || "待填写", "产出：每个障碍对应一个承诺或交付。"),
    stepItem("05", stepGuides[4], `${data.attention}、${data.effortModel}、${data.support}、${data.cadence}`, "产出：客户更容易成功、你也能交付的载体组合。"),
    stepItem("06", stepGuides[5], `保留：${data.coreStack || "待填写"}；删减：${data.trimmed || "待填写"}`, "产出：高价值、低成本的主报价。"),
    stepItem("07", stepGuides[6], `奖金：${splitLines(data.bonuses).length} 个；保证：${data.guarantee || "待填写"}`, "产出：更高感知价值和更低购买风险。"),
    stepItem("08", stepGuides[7], `${data.offerName || "待命名"}，价格 ${data.price || "待定"}。${data.validation || ""}`, "产出：可拿去真实销售对话中测试的报价。")
  ].join("");
}

function diagnosisItem(type, title, body) {
  return `
    <article class="diagnosis-item ${type}">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </article>
  `;
}

function buildDiagnosis(data, score) {
  const items = [];
  const problems = splitLines(data.beforeProblems).length + splitLines(data.duringProblems).length + splitLines(data.afterProblems).length;
  const solutions = splitLines(data.solutions).length;
  const bonuses = splitLines(data.bonuses).length;
  const reach = Number(data.reachDifficulty || 1);

  items.push(diagnosisItem(score >= 74 ? "good" : "warn", "价值方程", score >= 74 ? "报价的梦寐结果、成功概率、速度和省力程度已经比较平衡。" : "优先提高成功概率，或降低客户等待时间和执行成本。"));
  items.push(diagnosisItem(problems >= 6 ? "good" : "warn", "问题清单", problems >= 6 ? "障碍拆得足够细，后续更容易设计奖金和交付。" : "问题还不够多，按开始前、执行中、完成后继续追问。"));
  items.push(diagnosisItem(solutions >= problems && problems > 0 ? "good" : "warn", "方案覆盖", solutions >= problems && problems > 0 ? "解决方案数量能覆盖主要障碍。" : "关键动作是每个问题都对应一个解决方案，现在还需要补齐。"));
  items.push(diagnosisItem(bonuses >= 3 ? "good" : "warn", "奖金", bonuses >= 3 ? "奖金数量足够，下一步给每个奖金明确命名和用途。" : "奖金应该处理具体异议，不是随便送东西；建议至少补到 3 个。"));
  items.push(diagnosisItem(reach <= 5 ? "good" : "warn", "触达与紧迫", reach <= 5 ? "目标客户相对容易触达，适合快速验证。" : "如果触达难度高，先缩小市场或选择更集中的渠道。"));

  return items.join("");
}

function buildScript(data) {
  return [
    block("开场定位", `我做的不是普通的${escapeHtml(data.coreStack || "服务")}，而是帮助${escapeHtml(data.market)}拿到“${escapeHtml(data.dreamOutcome)}”。`),
    block("放大问题", `你现在卡住的不是单点技巧，而是这些障碍没有被系统处理：${escapeHtml([...splitLines(data.beforeProblems), ...splitLines(data.duringProblems)].slice(0, 4).join("；"))}。`),
    block("机制转折", `所以这个报价会用 ${escapeHtml(data.attention)}、${escapeHtml(data.effortModel)} 和 ${escapeHtml(data.support)}，把成功概率提高，同时减少你自己摸索的时间。`),
    block("风险逆转", `如果你按要求完成动作，仍然没有进入可测试状态，${escapeHtml(data.guarantee || "我会提供明确补救方案")}。`),
    block("下一步", `本轮${escapeHtml(data.scarcity || "名额有限")}，${escapeHtml(data.urgency || "需要在本轮截止前决定")}。下一步是先做资格评估，确认这个报价是否适合你。`)
  ].join("");
}

function plainText(data, score) {
  return [
    `大满贯报价评分：${score}/100`,
    "",
    `1. 市场：${data.market}`,
    `2. Dream Outcome：${data.dreamOutcome}`,
    `3. 开始前问题：${splitLines(data.beforeProblems).join("；")}`,
    `4. 执行中问题：${splitLines(data.duringProblems).join("；")}`,
    `5. 完成后问题：${splitLines(data.afterProblems).join("；")}`,
    `6. 解决方案：${splitLines(data.solutions).join("；")}`,
    `7. 交付载体：${data.attention} / ${data.effortModel} / ${data.support} / ${data.cadence}`,
    `8. 核心交付：${data.coreStack}`,
    `9. 删减部分：${data.trimmed}`,
    `10. 奖金：${splitLines(data.bonuses).join("；")}`,
    `11. 保证：${data.guarantee}`,
    `12. 稀缺：${data.scarcity}`,
    `13. 紧迫：${data.urgency}`,
    `14. 名称：${data.offerName}`,
    `15. 价格：${data.price}`,
    `16. 验证计划：${data.validation}`
  ].join("\n");
}

function updateOutputs() {
  const data = getData();
  const score = calculateScore(data);
  scoreValue.textContent = score;
  scoreBar.style.width = `${score}%`;
  offerTitle.textContent = data.offerName || "你的大满贯报价";
  offerOutput.innerHTML = buildOffer(data);
  stepsOutput.innerHTML = buildSteps(data);
  diagnosisList.innerHTML = buildDiagnosis(data, score);
  scriptOutput.innerHTML = buildScript(data);

  document.querySelectorAll("output").forEach((output) => {
    const field = form.elements[output.dataset.for];
    if (field) output.textContent = field.value;
  });

  localStorage.setItem(storageKey, JSON.stringify(data));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

form.addEventListener("input", updateOutputs);
form.addEventListener("change", updateOutputs);

document.querySelector("#copyButton").addEventListener("click", async () => {
  const data = getData();
  const score = calculateScore(data);
  const text = plainText(data, score);
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  showToast("已复制报价方案");
});

document.querySelector("#resetButton").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  setData(defaults);
  showToast("已恢复示例");
});

closeReminderButton.addEventListener("click", () => {
  startupReminder.classList.add("hidden");
});

startupReminder.addEventListener("click", (event) => {
  if (event.target === startupReminder) {
    startupReminder.classList.add("hidden");
  }
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.tab}Tab`).classList.add("active");
  });
});

const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
setData(saved || defaults);
