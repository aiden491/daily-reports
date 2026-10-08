const COMPANIES = ["海底捞","百胜中国","达势股份","中国食品","海吉亚医疗","同仁堂科技","保利物业","黄金","铁矿石","豆粕"];

async function load() {
  const res = await fetch("data/reports.json");
  const data = await res.json();
  const reports = data.reports || [];

  // 公司筛选下拉
  const sel = document.getElementById("company-filter");
  COMPANIES.forEach(c => {
    const o = document.createElement("option");
    o.value = c; o.textContent = c; sel.appendChild(o);
  });

  document.getElementById("site-meta").textContent =
    `共收录 ${reports.length} 期报告` + (reports.length ? ` · 最近更新 ${reports[0].date}` : "");

  function render(filterText, company) {
    const kw = (filterText || "").trim().toLowerCase();
    const list = reports.filter(r => {
      if (company && !(r.companies || []).includes(company)) return false;
      if (!kw) return true;
      return (r.title + " " + r.date + " " + (r.summary || "")).toLowerCase().includes(kw);
    });

    // 最新
    const latestBox = document.getElementById("latest");
    if (!kw && !company && list.length) {
      const r = list[0];
      latestBox.innerHTML = cardHTML(r, true);
    } else {
      latestBox.innerHTML = "";
    }

    // 归档
    const arch = document.getElementById("archive");
    const rest = (!kw && !company && list.length) ? list.slice(1) : list;
    arch.innerHTML = rest.length ? rest.map(r => cardHTML(r, false)).join("")
      : `<div class="empty">没有匹配的报告</div>`;
  }

  function cardHTML(r, isLatest) {
    const tags = (r.tags || []).map(t => `<span class="pill">${t}</span>`).join("");
    return `<div class="card">
      <div class="date">${r.date}${isLatest ? ' · 最新' : ''}</div>
      <h3><a href="${r.url}">${r.title}</a></h3>
      <div class="summary">${r.summary || ""}</div>
      <div class="tags">${tags}</div>
    </div>`;
  }

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => render(searchInput.value, sel.value));
  sel.addEventListener("change", () => render(searchInput.value, sel.value));
  render("", "");
}

load().catch(() => {
  document.getElementById("site-meta").textContent = "报告索引加载失败";
});
