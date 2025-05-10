
let projects = [];

function calculateBudget() {
  const name = document.getElementById("projectName").value;
  const value = parseFloat(document.getElementById("projectValue").value);
  if (!name || isNaN(value)) return;

  const budget = {
    labor: value * 0.65,
    material: value * 0.10,
    equip: value * 0.05,
    overhead: value * 0.10,
    profit: value * 0.10,
  };

  const actual = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };

  projects.push({ name, budget, actual });
  renderTable();
}

function updateActual(index, field, value) {
  const v = parseFloat(value);
  if (!isNaN(v)) {
    projects[index].actual[field] = v;
    renderTable();
  }
}

function deleteProject(index) {
  projects.splice(index, 1);
  renderTable();
}

function renderTable() {
  const body = document.getElementById("projectTableBody");
  body.innerHTML = "";
  let totalBudget = 0, totalActual = 0;
  let summaryBudget = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };
  let summaryActual = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };

  projects.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = \`
      <td>\${p.name}</td>
      <td>\${p.budget.labor.toFixed(2)}</td>
      <td>\${p.budget.material.toFixed(2)}</td>
      <td>\${p.budget.equip.toFixed(2)}</td>
      <td>\${p.budget.overhead.toFixed(2)}</td>
      <td>\${p.budget.profit.toFixed(2)}</td>
      <td><input type="number" value="\${p.actual.labor}" onchange="updateActual(\${i}, 'labor', this.value)" /></td>
      <td><input type="number" value="\${p.actual.material}" onchange="updateActual(\${i}, 'material', this.value)" /></td>
      <td><input type="number" value="\${p.actual.equip}" onchange="updateActual(\${i}, 'equip', this.value)" /></td>
      <td><input type="number" value="\${p.actual.overhead}" onchange="updateActual(\${i}, 'overhead', this.value)" /></td>
      <td><input type="number" value="\${p.actual.profit}" onchange="updateActual(\${i}, 'profit', this.value)" /></td>
      <td><button onclick="deleteProject(\${i})">ลบ</button></td>
    \`;
    body.appendChild(row);

    if (Object.values(p.actual).some(v => v > 0)) {
      summaryBudget.labor += p.budget.labor;
      summaryBudget.material += p.budget.material;
      summaryBudget.equip += p.budget.equip;
      summaryBudget.overhead += p.budget.overhead;
      summaryBudget.profit += p.budget.profit;

      summaryActual.labor += p.actual.labor;
      summaryActual.material += p.actual.material;
      summaryActual.equip += p.actual.equip;
      summaryActual.overhead += p.actual.overhead;
      summaryActual.profit += p.actual.profit;
    }
  });

  const totalB = Object.values(summaryBudget).reduce((a, b) => a + b, 0);
  const totalA = Object.values(summaryActual).reduce((a, b) => a + b, 0);
  const summary = document.getElementById("summaryReport");
  const resultClass = totalA > totalB ? 'red' : 'green';
  summary.innerHTML = \`
    <p>ยอดรวม Budget: <strong>\${totalB.toFixed(2)}</strong></p>
    <p>ยอดรวม Actual: <strong class="\${resultClass}">\${totalA.toFixed(2)}</strong></p>
  \`;

  renderChart(summaryBudget, summaryActual);
}

let chart;
function renderChart(budget, actual) {
  const ctx = document.getElementById("comparisonChart").getContext("2d");
  const labels = ["แรงงาน", "วัสดุ", "อุปกรณ์", "Overhead", "กำไร"];
  const dataB = [budget.labor, budget.material, budget.equip, budget.overhead, budget.profit];
  const dataA = [actual.labor, actual.material, actual.equip, actual.overhead, actual.profit];

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Budget", data: dataB, backgroundColor: "rgba(54, 162, 235, 0.6)" },
        { label: "Actual", data: dataA, backgroundColor: "rgba(255, 99, 132, 0.6)" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'เปรียบเทียบ Budget กับ Actual' }
      }
    }
  });
}
