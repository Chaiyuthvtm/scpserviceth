
const tableBody = document.getElementById("projectTableBody");
const projectNameInput = document.getElementById("projectName");
const projectValueInput = document.getElementById("projectValue");

const chartLabels = ["Labor", "Material", "Equip", "Overhead", "Profit"];
const chartData = [0, 0, 0, 0, 0];
const ctx = document.getElementById("actualChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: chartLabels,
    datasets: [{
      label: "Actual Cost",
      data: chartData,
      backgroundColor: "rgba(54, 162, 235, 0.5)",
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function calculateBudget() {
  const name = projectNameInput.value.trim();
  const value = parseFloat(projectValueInput.value);
  if (!name || isNaN(value) || value <= 0) return alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");

  const budget = {
    labor: value * 0.65,
    material: value * 0.10,
    equip: value * 0.05,
    overhead: value * 0.10,
    profit: value * 0.10
  };

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${name}</td>
    <td>${budget.labor.toFixed(2)}</td>
    <td>${budget.material.toFixed(2)}</td>
    <td>${budget.equip.toFixed(2)}</td>
    <td>${budget.overhead.toFixed(2)}</td>
    <td>${budget.profit.toFixed(2)}</td>
    <td><input type="number" value="0" oninput="updateChart()"></td>
    <td><input type="number" value="0" oninput="updateChart()"></td>
    <td><input type="number" value="0" oninput="updateChart()"></td>
    <td><input type="number" value="0" oninput="updateChart()"></td>
    <td><input type="number" value="0" oninput="updateChart()"></td>
    <td><button onclick="this.closest('tr').remove(); updateChart();">Delete</button></td>
  `;
  tableBody.appendChild(tr);
  updateChart();
}

function updateChart() {
  const rows = [...tableBody.querySelectorAll("tr")];
  const totals = [0, 0, 0, 0, 0];
  rows.forEach(row => {
    row.querySelectorAll("input").forEach((input, i) => {
      totals[i] += parseFloat(input.value) || 0;
    });
  });
  chart.data.datasets[0].data = totals;
  chart.update();
}
