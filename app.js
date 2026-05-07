const form = document.querySelector("#offerForm");
const scoreValue = document.querySelector("#scoreValue");
const scoreBar = document.querySelector("#scoreBar");
const offerOutput = document.querySelector("#offerOutput");
const diagnosisList = document.querySelector("#diagnosisList");
const scriptOutput = document.querySelector("#scriptOutput");
const offerTitle = document.querySelector("#offerTitle");
const toast = document.querySelector("#toast");
const storageKey = "grand-slam-offer-builder-v1";

const defaults = {
  customer: "想把专业能力产品化、但成交率不稳定的顾问和知识创业者",
  pain: "报价听起来像普通服务，客户总要比较价格；成交周期长，咨询后没有明确下一步。",
  dream: "在 30 天内设计出一个让客户愿意马上行动的高价值报价，并完成第一轮成交验证。",
  mechanism: "用价值方程拆解客户结果，逐项降低等待时间、执行阻力和购买风险，再用奖金、保证和稀缺性重组报价。",
  outcome: "7",
  likelihood: "6",
  delay: "4",
  effort: "4",
  delivery: "1 对 1 报价诊断、报价结构工作坊、成交页文案、三次迭代评审、销售问答脚本。",
  bonuses: "客户痛点访谈清单\n奖金命名模板\n保证条款检查表\n报价页结构示例",
  guarantee: "完成全部作业并参加评审后，若仍无法形成可测试报价，免费延长一次迭代周期。",
  price: "9800",
  scarcity: "每月仅接 12 个项目"
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
    .split(/\n|、|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function calculateScore(data) {
  const outcome = Number(data.outcome || 1);
  const likelihood = Number(data.likelihood || 1);
  const delay = Number(data.delay || 1);
  const effort = Number(data.effort || 1);
  const raw = (outcome * 5.5 + likelihood * 4.5 + (11 - delay) * 3 + (11 - effort) * 3) * 1.25;
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

function buildOffer(data) {
  const bonuses = splitLines(data.bonuses);
  const bonusText = bonuses.length
    ? bonuses.map((item) => `「${escapeHtml(item)}」`).join("、")
    : "补充能提高成功率或降低执行阻力的奖金";

  return [
    block("一句话报价", `我帮助${escapeHtml(data.customer)}，通过${escapeHtml(data.mechanism)}，达成「${escapeHtml(data.dream)}」。`),
    block("核心痛点", escapeHtml(data.pain)),
    block("核心交付", escapeHtml(data.delivery)),
    block("奖金堆叠", bonusText),
    block("风险逆转", escapeHtml(data.guarantee)),
    block("价格与稀缺性", `标价：${escapeHtml(data.price || "待定")}。购买理由：${escapeHtml(data.scarcity || "设置真实产能限制或明确截止时间")}。`)
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
  const delay = Number(data.delay || 1);
  const effort = Number(data.effort || 1);
  const likelihood = Number(data.likelihood || 1);
  const bonuses = splitLines(data.bonuses);

  items.push(diagnosisItem(score >= 72 ? "good" : "warn", "总体吸引力", score >= 72 ? "报价已经有不错的价值感，可以继续增强证据和交付确定性。" : "报价还不够锋利，优先提高成功可信度，并减少客户需要自己摸索的部分。"));
  items.push(diagnosisItem(likelihood >= 7 ? "good" : "warn", "成功可信度", likelihood >= 7 ? "机制、案例或过程证据足够明确。" : "加入案例、诊断流程、里程碑、交付截图或前置评估，让客户相信自己也能达成。"));
  items.push(diagnosisItem(delay <= 4 ? "good" : "warn", "时间延迟", delay <= 4 ? "客户能较快看见进展，这是强卖点。" : "设计 7 天内可见的小胜利，例如诊断报告、第一版方案或即时反馈。"));
  items.push(diagnosisItem(effort <= 4 ? "good" : "warn", "努力成本", effort <= 4 ? "执行阻力控制得较好。" : "把客户要做的事变成模板、清单、代办服务或陪跑节点。"));
  items.push(diagnosisItem(bonuses.length >= 3 ? "good" : "warn", "奖金结构", bonuses.length >= 3 ? "奖金数量足够，下一步给每个奖金命名并说明价值。" : "奖金不是赠品堆砌，而是专门移除购买障碍和执行障碍的组件。"));

  return items.join("");
}

function buildScript(data) {
  return [
    block("开场定位", `你现在不是缺少努力，而是报价没有把「${escapeHtml(data.dream)}」包装成一个足够确定、足够省力的购买决定。`),
    block("痛点放大", `如果继续用普通服务报价，${escapeHtml(data.pain)} 这个问题会继续让客户拿你和低价选项比较。`),
    block("机制转折", `所以我会用这套机制处理：${escapeHtml(data.mechanism)}。它的重点不是增加复杂度，而是让结果更可预期。`),
    block("行动邀请", `如果你符合条件，下一步是进入「${escapeHtml(data.scarcity || "本期名额")}」的评估，我会先判断这个报价是否值得你现在做。`)
  ].join("");
}

function plainText(data, score) {
  return [
    `大满贯报价评分：${score}/100`,
    "",
    `目标客户：${data.customer}`,
    `梦想结果：${data.dream}`,
    `核心痛点：${data.pain}`,
    `可信机制：${data.mechanism}`,
    `核心交付：${data.delivery}`,
    `奖金组件：${splitLines(data.bonuses).join("；")}`,
    `保证机制：${data.guarantee}`,
    `价格：${data.price}`,
    `稀缺性：${data.scarcity}`
  ].join("\n");
}

function updateOutputs() {
  const data = getData();
  const score = calculateScore(data);
  scoreValue.textContent = score;
  scoreBar.style.width = `${score}%`;
  offerTitle.textContent = data.customer ? `${data.customer}的大满贯报价` : "你的大满贯报价";
  offerOutput.innerHTML = buildOffer(data);
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
