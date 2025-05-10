let projects = [];

function calculateBudget() {
  const name = document.getElementById('projectName').value;
  const value = parseFloat(document.getElementById('projectValue').value);
  if (!name || isNaN(value)) return;

  const project = {
    name,
    budget: {
      labor: value * 0.65,
      material: value * 0.10,
      equip: value * 0.05,
      overhead: value * 0.10,
      profit: value * 0.10
    },
    actual: {
      labor: 0,
      material: 0,
      equip: 0,
      overhead: 0,
      profit: 0
    }
  };

  projects.push(project);
  renderTable();
  renderChart();
}

function updateActual(index, field, value) {
  projects[index].actual[field] = parseFloat(value) || 0;
  renderChart();
}

function deleteProject(index) {
  projects.splice(index, 1);
  renderTable();
  renderChart();
}

function renderTable() {
  const tbody = document.getElementById('projectTableBody');
  tbody.innerHTML = '';

  projects.forEach((proj, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${proj.name}</td>
      <td>${format(proj.budget.labor)}</td>
      <td>${format(proj.budget.material)}</td>
      <td>${format(proj.budget.equip)}</td>
      <td>${format(proj.budget.overhead)}</td>
      <td>${format(proj.budget.profit)}</td>
      <td><input type="number" onchange="updateActual(${index}, 'labor', this.value)" value="${proj.actual.labor}" /></td>
      <td><input type="number" onchange="updateActual(${index}, 'material', this.value)" value="${proj.actual.material}" /></td>
      <td><input type="number" onchange="updateActual(${index}, 'equip', this.value)" value="${proj.actual.equip}" /></td>
      <td><input type="number" onchange="updateActual(${index}, 'overhead', this.value)" value="${proj.actual.overhead}" /></td>
      <td><input type="number" onchange="updateActual(${index}, 'profit', this.value)" value="${proj.actual.profit}" /></td>
      <td><button onclick="deleteProject(${index})">ลบ</button></td>
    `;
    tbody.appendChild(row);
  });
}

function renderChart() {
  const totals = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };
  projects.forEach(p => {
    totals.labor += p.actual.labor;
    totals.material += p.actual.material;
    totals.equip += p.actual.equip;
    totals.overhead += p.actual.overhead;
    totals.profit += p.actual.profit;
  });

  const ctx = document.getElementById('actualChart').getContext('2d');
  if (window.actualChartInstance) window.actualChartInstance.destroy();
  window.actualChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Labor', 'Material', 'Equip', 'Overhead', 'Profit'],
      datasets: [{
        data: [
          totals.labor,
          totals.material,
          totals.equip,
          totals.overhead,
          totals.profit
        ],
        backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#facc15', '#a78bfa']
      }]
    }
  });
}

function format(num) {
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}