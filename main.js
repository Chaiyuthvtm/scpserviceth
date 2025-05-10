
let projects = [];

function calculateBudget() {
  const name = document.getElementById("projectName").value;
  const value = parseFloat(document.getElementById("projectValue").value);
  if (isNaN(value)) return alert("กรุณากรอกมูลค่าโครงการ");

  const budget = {
    labor: value * 0.65,
    material: value * 0.10,
    equip: value * 0.05,
    overhead: value * 0.10,
    profit: value * 0.10
  };

  document.getElementById("budgetList").innerHTML = `
    <li>ค่าแรง: ${budget.labor.toFixed(2)}</li>
    <li>วัสดุสิ้นเปลือง: ${budget.material.toFixed(2)}</li>
    <li>อุปกรณ์ช่วย: ${budget.equip.toFixed(2)}</li>
    <li>Overhead: ${budget.overhead.toFixed(2)}</li>
    <li>กำไร: ${budget.profit.toFixed(2)}</li>
  `;

  window.currentBudget = budget;
}

function saveProject() {
  const actual = {
    labor: parseFloat(document.getElementById("actualLabor").value) || 0,
    material: parseFloat(document.getElementById("actualMaterial").value) || 0,
    equip: parseFloat(document.getElementById("actualEquip").value) || 0,
    overhead: parseFloat(document.getElementById("actualOverhead").value) || 0,
    profit: parseFloat(document.getElementById("actualProfit").value) || 0
  };

  const project = {
    name: document.getElementById("projectName").value,
    budget: window.currentBudget,
    actual: actual
  };

  projects.push(project);
  renderHistory();
  renderSummary();
}

function renderHistory() {
  const tbody = document.getElementById("projectTableBody");
  tbody.innerHTML = "";
  projects.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = \`
      <td>\${p.name}</td>
      <td>\${Object.values(p.budget).reduce((a, b) => a + b, 0).toFixed(2)}</td>
      <td>\${Object.values(p.actual).reduce((a, b) => a + b, 0).toFixed(2)}</td>
      <td><button onclick="deleteProject(\${i})">ลบ</button></td>
    \`;
    tbody.appendChild(tr);
  });
}

function deleteProject(index) {
  projects.splice(index, 1);
  renderHistory();
  renderSummary();
}

function renderSummary() {
  let totalBudget = 0, totalActual = 0;

  projects.forEach(p => {
    totalBudget += Object.values(p.budget).reduce((a, b) => a + b, 0);
    totalActual += Object.values(p.actual).reduce((a, b) => a + b, 0);
  });

  const summary = document.getElementById("summaryText");
  if (totalBudget === 0) {
    summary.innerHTML = "ยังไม่มีข้อมูล Actual";
  } else {
    const color = totalActual > totalBudget ? "red" : "green";
    summary.innerHTML = \`ยอดรวม Budget: <span class="bold">\${totalBudget.toFixed(2)}</span> |
      ยอดรวม Actual: <span class="bold \${color}">\${totalActual.toFixed(2)}</span>\` ;
  }

  renderChart(totalBudget, totalActual);
}

function renderChart(budget, actual) {
  const ctx = document.getElementById("comparisonChart").getContext("2d");
  if (window.bar) window.bar.destroy();
  window.bar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Budget", "Actual"],
      datasets: [{
        label: "ยอดรวม",
        data: [budget, actual],
        backgroundColor: ["#36a2eb", "#ff6384"]
      }]
    }
  });
}
