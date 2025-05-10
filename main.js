document.addEventListener("DOMContentLoaded", function () {
  const projectNameInput = document.getElementById("projectName");
  const projectValueInput = document.getElementById("projectValue");
  const projectTableBody = document.getElementById("projectTableBody");
  const pieChartCanvas = document.getElementById("actualPieChart");
  const actualSummaryReport = document.getElementById("actualSummaryReport");

  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  function formatNumber(num) {
    return parseFloat(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
    renderTable();
    updateSummary();
  }

  function calculateBudget() {
    const name = projectNameInput.value.trim();
    const value = parseFloat(projectValueInput.value);
    if (!name || isNaN(value)) return alert("กรุณากรอกชื่อและมูลค่าโครงการให้ถูกต้อง");

    const labor = value * 0.65;
    const material = value * 0.10;
    const equip = value * 0.05;
    const overhead = value * 0.10;
    const profit = value * 0.10;

    const project = {
      name,
      value,
      budget: { labor, material, equip, overhead, profit },
      actual: { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 }
    };

    projects.push(project);
    saveProjects();
    projectNameInput.value = "";
    projectValueInput.value = "";
  }

  function updateActual(index, field, value) {
    projects[index].actual[field] = parseFloat(value) || 0;
    saveProjects();
  }

  function deleteProject(index) {
    projects.splice(index, 1);
    saveProjects();
  }

  function renderTable() {
    projectTableBody.innerHTML = "";
    projects.forEach((proj, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = \`
        <td rowspan="2">\${proj.name}</td>
        <td>\${formatNumber(proj.budget.labor)}</td>
        <td>\${formatNumber(proj.budget.material)}</td>
        <td>\${formatNumber(proj.budget.equip)}</td>
        <td>\${formatNumber(proj.budget.overhead)}</td>
        <td>\${formatNumber(proj.budget.profit)}</td>
        <td><input type="number" value="\${proj.actual.labor}" onchange="updateActualFromInput(\${idx}, 'labor', this.value)"></td>
        <td><input type="number" value="\${proj.actual.material}" onchange="updateActualFromInput(\${idx}, 'material', this.value)"></td>
        <td><input type="number" value="\${proj.actual.equip}" onchange="updateActualFromInput(\${idx}, 'equip', this.value)"></td>
        <td><input type="number" value="\${proj.actual.overhead}" onchange="updateActualFromInput(\${idx}, 'overhead', this.value)"></td>
        <td><input type="number" value="\${proj.actual.profit}" onchange="updateActualFromInput(\${idx}, 'profit', this.value)"></td>
        <td rowspan="2"><button onclick="deleteProject(\${idx})">ลบ</button></td>
      \`;
      const spacer = document.createElement("tr");
      spacer.innerHTML = "<td colspan='10'></td>";
      projectTableBody.appendChild(row);
      projectTableBody.appendChild(spacer);
    });
  }

  function updateSummary() {
    const total = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };

    projects.forEach(p => {
      total.labor += p.actual.labor;
      total.material += p.actual.material;
      total.equip += p.actual.equip;
      total.overhead += p.actual.overhead;
      total.profit += p.actual.profit;
    });

    if (window.pieChart) pieChart.destroy();
    window.pieChart = new Chart(pieChartCanvas, {
      type: "pie",
      data: {
        labels: ["Labor", "Material", "Equip", "Overhead", "Profit"],
        datasets: [{
          label: "Actual Cost",
          data: [total.labor, total.material, total.equip, total.overhead, total.profit],
          backgroundColor: ["#f94144", "#f3722c", "#f8961e", "#90be6d", "#577590"]
        }]
      }
    });

    actualSummaryReport.innerHTML = \`
      <ul>
        <li>ค่าแรงรวม: \${formatNumber(total.labor)} บาท</li>
        <li>วัสดุรวม: \${formatNumber(total.material)} บาท</li>
        <li>อุปกรณ์ช่วยรวม: \${formatNumber(total.equip)} บาท</li>
        <li>ค่า overhead รวม: \${formatNumber(total.overhead)} บาท</li>
        <li>กำไรรวม: \${formatNumber(total.profit)} บาท</li>
      </ul>
    \`;
  }

  // Expose functions to global scope
  window.calculateBudget = calculateBudget;
  window.updateActualFromInput = updateActual;
  window.deleteProject = deleteProject;

  // Initial render
  renderTable();
  updateSummary();
});