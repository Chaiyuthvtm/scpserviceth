
function calculateBudget() {
  const name = document.getElementById("projectName").value;
  const value = parseFloat(document.getElementById("projectValue").value);

  if (!name || isNaN(value)) {
    alert("กรุณากรอกชื่อโครงการและมูลค่าให้ครบ");
    return;
  }

  const budget = {
    labor: value * 0.65,
    material: value * 0.10,
    equip: value * 0.05,
    overhead: value * 0.10,
    profit: value * 0.10
  };

  let list = document.getElementById("budgetList");
  list.innerHTML = `
    <li>ค่าแรง: ${budget.labor.toFixed(2)} บาท</li>
    <li>วัสดุสิ้นเปลือง: ${budget.material.toFixed(2)} บาท</li>
    <li>อุปกรณ์ช่วย: ${budget.equip.toFixed(2)} บาท</li>
    <li>Overhead: ${budget.overhead.toFixed(2)} บาท</li>
    <li>กำไร: ${budget.profit.toFixed(2)} บาท</li>
  `;

  document.getElementById("budgetSection").style.display = "block";
  window.currentBudget = budget;
}

function showSummary() {
  const actual = {
    labor: parseFloat(document.getElementById("actualLabor").value),
    material: parseFloat(document.getElementById("actualMaterial").value),
    equip: parseFloat(document.getElementById("actualEquip").value),
    overhead: parseFloat(document.getElementById("actualOverhead").value),
    profit: parseFloat(document.getElementById("actualProfit").value)
  };

  const budget = window.currentBudget;
  const tbody = document.querySelector("#summaryTable tbody");
  const tfoot = document.querySelector("#summaryTable tfoot");
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  let sumBudget = 0, sumActual = 0;

  for (let key in budget) {
    const row = document.createElement("tr");
    const over = actual[key] > budget[key];
    const cssClass = over ? "over" : "under";
    sumBudget += budget[key];
    sumActual += actual[key];
    row.innerHTML = `
      <td>${key.charAt(0).toUpperCase() + key.slice(1)}</td>
      <td>${budget[key].toFixed(2)}</td>
      <td class="${cssClass}">${actual[key].toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  }

  const totalRow = document.createElement("tr");
  const totalClass = sumActual > sumBudget ? "over" : "under";
  totalRow.innerHTML = `
    <th>รวม</th>
    <th>${sumBudget.toFixed(2)}</th>
    <th class="${totalClass}">${sumActual.toFixed(2)}</th>
  `;
  tfoot.appendChild(totalRow);

  document.getElementById("summarySection").style.display = "block";

  const ctx = document.getElementById("summaryChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Labor", "Material", "Equip", "Overhead", "Profit", "รวม"],
      datasets: [
        {
          label: "งบประมาณ",
          data: [budget.labor, budget.material, budget.equip, budget.overhead, budget.profit, sumBudget],
          backgroundColor: "#36A2EB"
        },
        {
          label: "Actual",
          data: [actual.labor, actual.material, actual.equip, actual.overhead, actual.profit, sumActual],
          backgroundColor: "#FF6384"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "เปรียบเทียบงบประมาณและค่าใช้จ่ายจริง" }
      }
    }
  });
}
