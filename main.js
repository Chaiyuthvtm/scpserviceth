
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateBudget() {
  const name = document.getElementById("projectName").value.trim();
  const value = parseFloat(document.getElementById("projectValue").value);
  if (!name || isNaN(value)) {
    alert("กรุณากรอกชื่อและมูลค่าโครงการให้ครบถ้วน");
    return;
  }

  const labor = value * 0.65;
  const material = value * 0.10;
  const equip = value * 0.05;
  const overhead = value * 0.10;
  const profit = value * 0.10;

  const project = {
    name, value,
    budget: { labor, material, equip, overhead, profit },
    actual: { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 }
  };

  addProjectRow(project);
  updateSummary();
}

function addProjectRow(project) {
  const tbody = document.getElementById("projectTableBody");
  const row = document.createElement("tr");

  function createCell(content, isActual = false, budgetVal = 0) {
    const td = document.createElement("td");
    if (typeof content === "string" || typeof content === "number") {
      td.textContent = typeof content === "number" ? formatNumber(content) : content;
    } else {
      td.appendChild(content);
    }

    if (isActual && content.tagName === 'INPUT') {
      content.addEventListener("input", () => {
        const value = parseFloat(content.value) || 0;
        if (value > budgetVal) {
          content.classList.add("red-text");
        } else {
          content.classList.remove("red-text");
        }
        updateSummary();
      });
    }

    return td;
  }

  row.appendChild(createCell(project.name));
  Object.values(project.budget).forEach(val => row.appendChild(createCell(val)));

  Object.entries(project.budget).forEach(([key, budgetVal]) => {
    const input = document.createElement("input");
    input.type = "number";
    input.value = 0;
    input.className = "actual-input";
    row.appendChild(createCell(input, true, budgetVal));
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "ลบ";
  deleteBtn.onclick = () => {
    row.remove();
    updateSummary();
  };
  row.appendChild(createCell(deleteBtn));

  tbody.appendChild(row);
}

function updateSummary() {
  const inputs = document.querySelectorAll(".actual-input");
  const categories = ["labor", "material", "equip", "overhead", "profit"];
  const summary = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };

  inputs.forEach((input, index) => {
    const key = categories[index % 5];
    summary[key] += parseFloat(input.value) || 0;
  });

  const report = `
    <p><strong>ยอดสะสม Actual Cost:</strong></p>
    <ul>
      <li>ค่าแรง: ${formatNumber(summary.labor)} บาท</li>
      <li>วัสดุสิ้นเปลือง: ${formatNumber(summary.material)} บาท</li>
      <li>อุปกรณ์ช่วย: ${formatNumber(summary.equip)} บาท</li>
      <li>Overhead: ${formatNumber(summary.overhead)} บาท</li>
      <li>กำไร: ${formatNumber(summary.profit)} บาท</li>
    </ul>
  `;
  document.getElementById("summaryReport").innerHTML = report;
}
