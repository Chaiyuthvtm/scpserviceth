
let history = [];
const ctx = document.getElementById('actualChart').getContext('2d');
let chart;

function format(n) {
  return Number(n).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function calculate() {
  const name = document.getElementById('projectName').value;
  const value = parseFloat(document.getElementById('projectValue').value);
  if (!name || isNaN(value)) return alert('กรุณาใส่ข้อมูลให้ครบ');

  const labor = value * 0.65;
  const material = value * 0.10;
  const equip = value * 0.05;
  const overhead = value * 0.10;
  const profit = value * 0.10;

  const project = { name, value, budget: { labor, material, equip, overhead, profit }, actual: { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 } };
  history.push(project);
  renderTable();
  updateChart();
}

function renderTable() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  history.forEach((p, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td rowspan="2">${p.name}</td>
      <td>${format(p.budget.labor)}</td><td>${format(p.budget.material)}</td><td>${format(p.budget.equip)}</td><td>${format(p.budget.overhead)}</td><td>${format(p.budget.profit)}</td>
      <td><input type="number" value="${p.actual.labor}" onchange="updateActual(${i}, 'labor', this.value)" /></td>
      <td><input type="number" value="${p.actual.material}" onchange="updateActual(${i}, 'material', this.value)" /></td>
      <td><input type="number" value="${p.actual.equip}" onchange="updateActual(${i}, 'equip', this.value)" /></td>
      <td><input type="number" value="${p.actual.overhead}" onchange="updateActual(${i}, 'overhead', this.value)" /></td>
      <td><input type="number" value="${p.actual.profit}" onchange="updateActual(${i}, 'profit', this.value)" /></td>
      <td rowspan="2"><button onclick="deleteProject(${i})">Delete</button></td>
    `;
    tbody.appendChild(row);

    const row2 = document.createElement('tr');
    row2.innerHTML = '<td colspan="10"></td>';
    tbody.appendChild(row2);
  });
}

function updateActual(index, field, value) {
  history[index].actual[field] = parseFloat(value) || 0;
  updateChart();
}

function deleteProject(index) {
  history.splice(index, 1);
  renderTable();
  updateChart();
}

function updateChart() {
  const total = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };
  history.forEach(p => {
    total.labor += p.actual.labor;
    total.material += p.actual.material;
    total.equip += p.actual.equip;
    total.overhead += p.actual.overhead;
    total.profit += p.actual.profit;
  });

  const data = [total.labor, total.material, total.equip, total.overhead, total.profit];
  if (chart) {
    chart.data.datasets[0].data = data;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Labor', 'Material', 'Equip', 'Overhead', 'Profit'],
        datasets: [{
          label: 'Actual Cost',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
