
function calculateBudget() {
  const name = document.getElementById("projectName").value;
  const value = parseFloat(document.getElementById("projectValue").value);

  if (!name || isNaN(value)) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  const budget = {
    labor: value * 0.65,
    material: value * 0.10,
    equip: value * 0.05,
    overhead: value * 0.10,
    profit: value * 0.10
  };

  const actual = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };

  const table = document.getElementById("projectTableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${name}</td>
    <td>${budget.labor.toFixed(2)}</td>
    <td>${budget.material.toFixed(2)}</td>
    <td>${budget.equip.toFixed(2)}</td>
    <td>${budget.overhead.toFixed(2)}</td>
    <td>${budget.profit.toFixed(2)}</td>
    <td><input type="number" value="0" onchange="updateActual(this, ${table.rows.length}, 'labor')"></td>
    <td><input type="number" value="0" onchange="updateActual(this, ${table.rows.length}, 'material')"></td>
    <td><input type="number" value="0" onchange="updateActual(this, ${table.rows.length}, 'equip')"></td>
    <td><input type="number" value="0" onchange="updateActual(this, ${table.rows.length}, 'overhead')"></td>
    <td><input type="number" value="0" onchange="updateActual(this, ${table.rows.length}, 'profit')"></td>
    <td><button onclick="deleteRow(this)">ลบ</button></td>
  `;
  table.appendChild(row);
  updateChart();
}

function deleteRow(button) {
  const row = button.closest("tr");
  row.remove();
  updateChart();
}

function updateActual(input, index, field) {
  // Placeholder for logic if data needs to be saved or processed
  updateChart();
}

function updateChart() {
  const rows = document.querySelectorAll("#projectTableBody tr");
  let total = 0;

  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    inputs.forEach(input => total += parseFloat(input.value) || 0);
  });

  const ctx = document.getElementById("actualChart").getContext("2d");
  if (window.actualChart) {
    window.actualChart.destroy();
  }

  window.actualChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Actual Cost"],
      datasets: [{
        label: "Total",
        data: [total],
        backgroundColor: ["#36A2EB"]
      }]
    }
  });
}
