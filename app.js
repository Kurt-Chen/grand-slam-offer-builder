const form = document.querySelector("#offerForm");
const scoreValue = document.querySelector("#scoreValue");
const scoreBar = document.querySelector("#scoreBar");
const offerOutput = document.querySelector("#offerOutput");
const stepsOutput = document.querySelector("#stepsOutput");
const diagnosisList = document.querySelector("#diagnosisList");
const scriptOutput = document.querySelector("#scriptOutput");
const offerTitle = document.querySelector("#offerTitle");
const toast = document.querySelector("#toast");
const storageKey = "grand-slam-offer-builder-v2";

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
    block("奖金组件", listHtml(bonuses, "加入能移除异议、提高成功概率的奖金。")),
    block("风险逆转", escapeHtml(data.guarantee)),
    block(
      "价格、稀缺、紧迫",
      `价格：${escapeHtml(data.price || "待定")}。稀缺：${escapeHtml(data.scarcity || "未设置")}。紧迫：${escapeHtml(data.urgency || "未设置")}。`
    ),
    block("验证计划", escapeHtml(data.validation))
  ].join("");
}

function stepItem(number, title, body, output) {
  return `
    <article class="process-item">
      <span>${number}</span>
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
        <strong>${escapeHtml(output)}</strong>
      </div>
    </article>
  `;
}

function buildSteps(data) {
  return [
    stepItem("01", "选市场", `市场：${data.market || "待填写"}。用痛苦、购买力、触达、成长性判断是否值得进入。`, "产出：一个明确、可触达、愿意付费的人群。"),
    stepItem("02", "定义梦寐以求的结果", data.dreamOutcome || "待填写", "产出：客户能复述、能衡量、愿意为之付费的结果。"),
    stepItem("03", "列障碍", "分别列出开始前、执行中、完成后的所有问题。", "产出：完整问题清单。"),
    stepItem("04", "逐条变解决方案", data.solutions || "待填写", "产出：每个障碍对应一个承诺或交付。"),
    stepItem("05", "设计交付载体", `${data.attention}、${data.effortModel}、${data.support}、${data.cadence}`, "产出：客户更容易成功、你也能交付的载体组合。"),
    stepItem("06", "删减并堆叠", `保留：${data.coreStack || "待填写"}；删减：${data.trimmed || "待填写"}`, "产出：高价值、低成本的主报价。"),
    stepItem("07", "加奖金、保证、稀缺、紧迫", `奖金：${splitLines(data.bonuses).length} 个；保证：${data.guarantee || "待填写"}`, "产出：更高感知价值和更低购买风险。"),
    stepItem("08", "命名、定价、验证", `${data.offerName || "待命名"}，价格 ${data.price || "待定"}。${data.validation || ""}`, "产出：可拿去真实销售对话中测试的报价。")
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
  items.push(diagnosisItem(problems >= 6 ? "good" : "warn", "问题清单", problems >= 6 ? "障碍拆得够细，后续更容易设计奖金和交付。" : "问题还不够多，按开始前、执行中、完成后继续追问。"));
  items.push(diagnosisItem(solutions >= problems && problems > 0 ? "good" : "warn", "方案覆盖", solutions >= problems && problems > 0 ? "解决方案数量能覆盖主要障碍。" : "书中的关键动作是每个问题都对应一个解决方案，现在还需要补齐。"));
  items.push(diagnosisItem(bonuses >= 3 ? "good" : "warn", "奖金", bonuses >= 3 ? "奖金数量足够，下一步给每个奖金明确命名和用途。" : "奖金应该处理具体异议，不是随便送东西；建议至少补到 3 个。"));
  items.push(diagnosisItem(reach <= 5 ? "good" : "warn", "触达与紧迫", reach <= 5 ? "目标客户相对容易触达，适合快速验证。" : "如果触达难度高，先缩小市场或选择更集中的渠道。"));

  return items.join("");
}

function buildScript(data) {
  return [
    block("开场定位", `我做的不是普通的${escapeHtml(data.coreStack || "服务")}，而是帮助${escapeHtml(data.market)}拿到“${escapeHtml(data.dreamOutcome)}”。`),
    block("放大问题", `你现在卡住的不是单点技巧，而是这些障碍没有被系统处理：${escapeHtml([...splitLines(data.beforeProblems), ...splitLines(data.duringProblems)].slice(0, 4).join("；"))}。`),
    block("机制转折", `所以这个报价会用${escapeHtml(data.attention)}、${escapeHtml(data.effortModel)}和${escapeHtml(data.support)}，把成功概率提高，同时减少你自己摸索的时间。`),
    block("风险逆转", `如果你按要求完成动作，仍然没有进入可测试状态，${escapeHtml(data.guarantee || "我会提供明确补救方案")}。`),
    block("下一步", `本轮${escapeHtml(data.scarcity || "名额有限")}，${escapeHtml(data.urgency || "需要在本轮截止前决定")}。下一步是先做资格评估，确认这个报价是否适合你。`)
  ].join("");
}

function plainText(data, score) {
  return [
    `Grand Slam Offer 评分：${score}/100`,
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
  offerTitle.textContent = data.offerName || "你的 Grand Slam Offer";
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
