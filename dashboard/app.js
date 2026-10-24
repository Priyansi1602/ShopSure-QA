// ShopSure QA — Executive Quality & Test Automation Dashboard Engine

// Embedded verified dataset ensuring zero CORS issues when opening index.html directly via file://
let dashboardData = null;

async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Network response not ok");
    dashboardData = await response.json();
  } catch (err) {
    console.warn("Loading via fetch failed (likely file:// protocol). Using embedded dataset fallback.", err);
    // Embedded fallback
    dashboardData = {
      project: "ShopSure QA — E-Commerce Quality Assurance and API Testing Suite",
      systemUnderTest: "https://dummyjson.com",
      executionDate: "October 2026",
      summary: {
        totalCases: 34,
        executedCases: 34,
        passed: 34,
        failed: 0,
        blocked: 0,
        notRun: 0,
        passRate: "100.0%",
        automatedAssertions: 59,
        automatedPassed: 59
      },
      modules: {
        "Product Management": { total: 8, passed: 8, failed: 0, blocked: 0, not_run: 0 },
        "Authentication": { total: 9, passed: 9, failed: 0, blocked: 0, not_run: 0 },
        "Shopping Cart": { total: 7, passed: 7, failed: 0, blocked: 0, not_run: 0 },
        "Order Validation": { total: 4, passed: 4, failed: 0, blocked: 0, not_run: 0 },
        "API Quality & SLA": { total: 6, passed: 6, failed: 0, blocked: 0, not_run: 0 }
      },
      defects: [
        {
          id: "BUG-001",
          title: "Parameter limit=0 overrides limit to 194 and returns entire catalog",
          module: "Product Management",
          severity: "Moderate (S3)",
          priority: "P3 (Medium)",
          status: "Verified / Specification Anomaly"
        },
        {
          id: "BUG-002",
          title: "Querying non-existent /orders route returns raw Express HTML rather than standard JSON 404",
          module: "Order Validation",
          severity: "Moderate (S3)",
          priority: "P3 (Medium)",
          status: "Verified / Documented Limitation"
        },
        {
          id: "BUG-003",
          title: "Login credential failure returns HTTP 400 Bad Request instead of standard HTTP 401 Unauthorized",
          module: "Authentication",
          severity: "Low (S4)",
          priority: "P4 (Low)",
          status: "Verified / Specification Nuance"
        }
      ],
      testCases: []
    };
  }

  // If test cases not loaded via fetch fallback, load from data.json or populate
  initDashboard();
}

function initDashboard() {
  renderKPIs();
  renderStatusChart();
  renderModuleChart();
  renderModuleTable();
  renderDefectTable();
  renderTestCases();
  setupFilterListeners();
}

// 1. Render Overview KPIs
function renderKPIs() {
  const s = dashboardData.summary;
  document.getElementById("kpi-total").textContent = s.totalCases;
  document.getElementById("kpi-executed").textContent = s.executedCases;
  document.getElementById("kpi-passed").textContent = s.passed;
  document.getElementById("kpi-failed").textContent = s.failed;
  document.getElementById("kpi-assertions").textContent = `${s.automatedPassed}/${s.automatedAssertions}`;
}

// 2. Render Status Pie Chart (Pure HTML5 Canvas)
function renderStatusChart() {
  const canvas = document.getElementById("statusChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const s = dashboardData.summary;

  const data = [
    { label: "Passed", value: s.passed, color: "#16A34A" },
    { label: "Failed", value: s.failed, color: "#DC2626" },
    { label: "Blocked", value: s.blocked, color: "#D97706" },
    { label: "Not Run", value: s.notRun, color: "#94A3B8" }
  ];

  const total = s.totalCases || 1;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startAngle = -Math.PI / 2;
  data.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    if (item.value > 0) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Subtle border
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
    }
    startAngle += sliceAngle;
  });

  // Inner cutout for doughnut look
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.55, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Center text (Pass %)
  ctx.font = "bold 18px Inter, sans-serif";
  ctx.fillStyle = "#0F172A";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(s.passRate, centerX, centerY - 6);

  ctx.font = "11px Inter, sans-serif";
  ctx.fillStyle = "#64748B";
  ctx.fillText("Pass Rate", centerX, centerY + 14);

  // Legend
  const legend = document.getElementById("status-legend");
  legend.innerHTML = data.map(d => `
    <div class="legend-item">
      <span class="legend-color" style="background:${d.color}"></span>
      <span>${d.label}: <strong>${d.value}</strong></span>
    </div>
  `).join("");
}

// 3. Render Module Distribution Chart (Pure HTML5 Canvas)
function renderModuleChart() {
  const canvas = document.getElementById("moduleChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const mods = dashboardData.modules;

  const labels = Object.keys(mods);
  const values = labels.map(k => mods[k].total);
  const maxVal = Math.max(...values, 10);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const paddingLeft = 40;
  const paddingBottom = 40;
  const chartWidth = canvas.width - paddingLeft - 20;
  const chartHeight = canvas.height - paddingBottom - 20;
  const barWidth = chartWidth / (labels.length * 1.6);
  const gap = chartWidth / labels.length;

  // Draw Grid Lines
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = canvas.height - paddingBottom - (i / 5) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(canvas.width - 20, y);
    ctx.stroke();

    // Axis label
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.textAlign = "right";
    ctx.fillText(Math.round((i / 5) * maxVal), paddingLeft - 8, y + 3);
  }

  // Draw Bars
  labels.forEach((label, i) => {
    const val = values[i];
    const h = (val / maxVal) * chartHeight;
    const x = paddingLeft + i * gap + (gap - barWidth) / 2;
    const y = canvas.height - paddingBottom - h;

    // Bar gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, "#2563EB");
    grad.addColorStop(1, "#3B82F6");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, h, [4, 4, 0, 0]);
    ctx.fill();

    // Value on top
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "#1E293B";
    ctx.textAlign = "center";
    ctx.fillText(val, x + barWidth / 2, y - 6);

    // Label below
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = "#475569";
    const shortLabel = label.split(" ")[0];
    ctx.fillText(shortLabel, x + barWidth / 2, canvas.height - paddingBottom + 16);
  });
}

// 4. Render Module Breakdown Table
function renderModuleTable() {
  const tbody = document.querySelector("#module-table tbody");
  if (!tbody) return;
  const mods = dashboardData.modules;

  tbody.innerHTML = Object.entries(mods).map(([name, data]) => {
    const exec = data.total - data.not_run;
    const rate = exec > 0 ? ((data.passed / exec) * 100).toFixed(1) + "%" : "0.0%";
    return `
      <tr>
        <td><strong>${name}</strong></td>
        <td>${data.total}</td>
        <td><span class="pill pill-pass">${data.passed}</span></td>
        <td><span class="pill ${data.failed > 0 ? 'pill-fail' : 'pill-notrun'}">${data.failed}</span></td>
        <td><span class="pill ${data.blocked > 0 ? 'pill-blocked' : 'pill-notrun'}">${data.blocked}</span></td>
        <td><span class="pill pill-notrun">${data.not_run}</span></td>
        <td><strong>${rate}</strong></td>
      </tr>
    `;
  }).join("");
}

// 5. Render Defect Summary Table
function renderDefectTable() {
  const tbody = document.querySelector("#defect-table tbody");
  if (!tbody) return;
  tbody.innerHTML = dashboardData.defects.map(d => `
    <tr>
      <td><strong>${d.id}</strong></td>
      <td>${d.module}</td>
      <td>${d.title}</td>
      <td><span class="pill pill-priority-medium">${d.severity}</span></td>
      <td><span class="pill pill-priority-high">${d.priority}</span></td>
      <td><span class="pill pill-notrun">${d.status}</span></td>
    </tr>
  `).join("");
}

// 6. Render Test Cases Table
function renderTestCases() {
  const tbody = document.getElementById("testcases-body");
  if (!tbody) return;

  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const statusFilter = document.getElementById("statusFilter")?.value || "ALL";
  const moduleFilter = document.getElementById("moduleFilter")?.value || "ALL";

  const filtered = (dashboardData.testCases || []).filter(tc => {
    const matchesSearch = 
      (tc["Test Case ID"] || "").toLowerCase().includes(search) ||
      (tc["Test Scenario"] || "").toLowerCase().includes(search) ||
      (tc["Test Steps"] || "").toLowerCase().includes(search) ||
      (tc["Actual Result"] || "").toLowerCase().includes(search);

    const matchesStatus = (statusFilter === "ALL") || (tc["Status"] === statusFilter);
    const matchesModule = (moduleFilter === "ALL") || (tc["Module"] === moduleFilter);

    return matchesSearch && matchesStatus && matchesModule;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#94A3B8;">No test cases matching current search filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(tc => {
    const statusPill = 
      tc["Status"] === "Pass" ? "pill-pass" :
      tc["Status"] === "Fail" ? "pill-fail" :
      tc["Status"] === "Blocked" ? "pill-blocked" : "pill-notrun";

    const prioPill = 
      tc["Priority"] === "Critical" ? "pill-priority-critical" :
      tc["Priority"] === "High" ? "pill-priority-high" :
      tc["Priority"] === "Medium" ? "pill-priority-medium" : "pill-priority-low";

    return `
      <tr>
        <td><code>${tc["Test Case ID"]}</code></td>
        <td>${tc["Module"]}</td>
        <td><strong>${tc["Test Scenario"]}</strong></td>
        <td style="font-size:0.8rem; color:#475569;">${tc["Expected Result"]}</td>
        <td style="font-size:0.8rem; color:#0F172A;">${tc["Actual Result"]}</td>
        <td><span class="pill ${statusPill}">${tc["Status"]}</span></td>
        <td><span class="pill ${prioPill}">${tc["Priority"]}</span></td>
      </tr>
    `;
  }).join("");
}

function setupFilterListeners() {
  document.getElementById("searchInput")?.addEventListener("input", renderTestCases);
  document.getElementById("statusFilter")?.addEventListener("change", renderTestCases);
  document.getElementById("moduleFilter")?.addEventListener("change", renderTestCases);
}

document.addEventListener("DOMContentLoaded", loadData);
