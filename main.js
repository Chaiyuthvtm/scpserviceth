// main.js

document.addEventListener("DOMContentLoaded", () => {
  const projectNameInput = document.getElementById("projectName");
  const projectValueInput = document.getElementById("projectValue");
  const resultDiv = document.getElementById("result");
  const historyTableBody = document.querySelector("#historyTable tbody");
  const summaryDiv = document.getElementById("summary");

  function format(number) {
    return number.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateBudget(value) {
    return {
      labor: value * 0.65,
      material: value * 0.10,
      equipment: value * 0.05,
      overhead: value * 0.10,
      profit: value * 0.10
    };
  }

  function renderHistory() {
    const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
    historyTableBody.innerHTML = "";

    data.forEach((project, index) => {
      const row1 = document.createElement("tr");
      row1.innerHTML = `
        <td rowspan="2">${project.name}</td>
        <td>${format(project.budget.labor)}</td>
        <td>${format(project.budget.material)}</td>
        <td>${format(project.budget.equipment)}</td>
        <td>${format(project.budget.overhead)}</td>
        <td>${format(project.budget.profit)}</td>
        <td rowspan="2"><button onclick="deleteProject(${index})">ลบ</button></td>
      `;
      historyTableBody.appendChild(row1);

      const actual = project.actual || { labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0 };
      const row2 = document.createElement("tr");
      row2.innerHTML = `
        <td><input type="number" value="${actual.labor}" onchange="updateActual(${index}, 'labor', this.value)"></td>
        <td><input type="number" value="${actual.material}" onchange="updateActual(${index}, 'material', this.value)"></td>
        <td><input type="number" value="${actual.equipment}" onchange="updateActual(${index}, 'equipment', this.value)"></td>
        <td><input type="number" value="${actual.overhead}" onchange="updateActual(${index}, 'overhead', this.value)"></td>
        <td><input type="number" value="${actual.profit}" onchange="updateActual(${index}, 'profit', this.value)"></td>
      `;
      historyTableBody.appendChild(row2);
    });
  }

  function renderSummary() {
    const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
    let sum = { labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0 };

    data.forEach(p => {
      if (p.actual) {
        sum.labor += p.actual.labor || 0;
        sum.material += p.actual.material || 0;
        sum.equipment += p.actual.equipment || 0;
        sum.overhead += p.actual.overhead || 0;
        sum.profit += p.actual.profit || 0;
      }
    });

    summaryDiv.innerHTML = `
      <h3>ยอด Actual Cost สะสม</h3>
      <p>ค่าแรง: ${format(sum.labor)}</p>
      <p>วัสดุสิ้นเปลือง: ${format(sum.material)}</p>
      <p>อุปกรณ์ช่วย: ${format(sum.equipment)}</p>
      <p>Overhead: ${format(sum.overhead)}</p>
      <p>กำไร: ${format(sum.profit)}</p>
    `;
  }

  document.getElementById("calculateBtn").addEventListener("click", () => {
    const name = projectNameInput.value.trim();
    const value = parseFloat(projectValueInput.value);
    if (!name || isNaN(value)) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    const budget = calculateBudget(value);

    const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
    data.push({ name, value, budget });
    localStorage.setItem("projectHistory", JSON.stringify(data));

    projectNameInput.value = "";
    projectValueInput.value = "";
    renderHistory();
    renderSummary();
  });

  window.updateActual = function(index, field, value) {
    const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
    if (!data[index].actual) data[index].actual = {};
    data[index].actual[field] = parseFloat(value) || 0;
    localStorage.setItem("projectHistory", JSON.stringify(data));
    renderSummary();
  };

  window.deleteProject = function(index) {
    const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
    data.splice(index, 1);
    localStorage.setItem("projectHistory", JSON.stringify(data));
    renderHistory();
    renderSummary();
  };

  renderHistory();
  renderSummary();
});
