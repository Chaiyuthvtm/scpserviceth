
function calculateBudget() {
  const projectName = document.getElementById("projectName").value;
  const projectValue = parseFloat(document.getElementById("projectValue").value);
  if (!projectName || isNaN(projectValue)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const labor = (projectValue * 0.65).toFixed(2);
  const material = (projectValue * 0.10).toFixed(2);
  const equip = (projectValue * 0.05).toFixed(2);
  const overhead = (projectValue * 0.10).toFixed(2);
  const profit = (projectValue * 0.10).toFixed(2);

  const tableBody = document.getElementById("projectTableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${projectName}</td>
    <td>${labor}</td>
    <td>${material}</td>
    <td>${equip}</td>
    <td>${overhead}</td>
    <td>${profit}</td>
    <td><input type="number" class="actual-input" data-type="labor" value="0" /></td>
    <td><input type="number" class="actual-input" data-type="material" value="0" /></td>
    <td><input type="number" class="actual-input" data-type="equip" value="0" /></td>
    <td><input type="number" class="actual-input" data-type="overhead" value="0" /></td>
    <td><input type="number" class="actual-input" data-type="profit" value="0" /></td>
    <td><button onclick="updateSummary()">ลง</button></td>
  `;

  tableBody.appendChild(row);
}

function updateSummary() {
  const summary = {
    labor: 0,
    material: 0,
    equip: 0,
    overhead: 0,
    profit: 0
  };

  const inputs = document.querySelectorAll(".actual-input");
  inputs.forEach(input => {
    const type = input.dataset.type;
    summary[type] += parseFloat(input.value) || 0;
  });

  document.getElementById("summaryReport").innerHTML = `
    <p>รวมค่าแรง: ${summary.labor.toFixed(2)} บาท</p>
    <p>รวมวัสดุสิ้นเปลือง: ${summary.material.toFixed(2)} บาท</p>
    <p>รวมอุปกรณ์ช่วย: ${summary.equip.toFixed(2)} บาท</p>
    <p>รวม Overhead: ${summary.overhead.toFixed(2)} บาท</p>
    <p>รวมกำไร: ${summary.profit.toFixed(2)} บาท</p>
  `;
}
