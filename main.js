document.addEventListener("DOMContentLoaded", () => {
  const $ = selector => document.querySelector(selector);
  const resultDiv = $("#result");
  const summaryDiv = $("#summary");
  const tbody = $("#historyTable tbody");
  const ctx = document.getElementById("summaryChart").getContext("2d");

  let chart;

  function format(n) {
    return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getProjects() {
    return JSON.parse(localStorage.getItem("projects") || "[]");
  }

  function saveProjects(data) {
    localStorage.setItem("projects", JSON.stringify(data));
  }

  function calculate(value) {
    return {
      labor: value * 0.65,
      material: value * 0.10,
      equipment: value * 0.05,
      overhead: value * 0.10,
      profit: value * 0.10
    };
  }

  function render() {
    const data = getProjects();
    tbody.innerHTML = "";

    data.forEach((p, i) => {
      const actual = p.actual || { labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0 };
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.name}</td>
        <td>${format(p.budget.labor)}</td>
        <td>${format(p.budget.material)}</td>
        <td>${format(p.budget.equipment)}</td>
        <td>${format(p.budget.overhead)}</td>
        <td>${format(p.budget.profit)}</td>
        <td><input type="number" value="${actual.labor}" onchange="updateActual(${i}, 'labor', this.value)"></td>
        <td><input type="number" value="${actual.material}" onchange="updateActual(${i}, 'material', this.value)"></td>
        <td><input type="number" value="${actual.equipment}" onchange="updateActual(${i}, 'equipment', this.value)"></td>
        <td><input type="number" value="${actual.overhead}" onchange="updateActual(${i}, 'overhead', this.value)"></td>
        <td><input type="number" value="${actual.profit}" onchange="updateActual(${i}, 'profit', this.value)"></td>
        <td><button onclick="deleteProject(${i})">X</button></td>
      `;
      tbody.appendChild(row);
    });

    renderSummary();
  }

  function renderSummary() {
    const data = getProjects();
    const sum = { labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0 };

    data.forEach(p => {
      if (p.actual) {
        sum.labor += +p.actual.labor;
        sum.material += +p.actual.material;
        sum.equipment += +p.actual.equipment;
        sum.overhead += +p.actual.overhead;
        sum.profit += +p.actual.profit;
      }
    });

    summaryDiv.innerHTML = `
      <p>Labor: ${format(sum.labor)}</p>
      <p>Material: ${format(sum.material)}</p>
      <p>Equipment: ${format(sum.equipment)}</p>
      <p>Overhead: ${format(sum.overhead)}</p>
      <p>Profit: ${format(sum.profit)}</p>
    `;

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Labor", "Material", "Equipment", "Overhead", "Profit"],
        datasets: [{
          label: "Actual Cost Summary",
          data: [sum.labor, sum.material, sum.equipment, sum.overhead, sum.profit],
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#17a2b8", "#dc3545"]
        }]
      }
    });
  }

  $("#calculateBtn").onclick = () => {
    const name = $("#projectName").value.trim();
    const value = parseFloat($("#projectValue").value);
    if (!name || isNaN(value)) return alert("Fill name and value");
    const budget = calculate(value);
    const data = getProjects();
    data.push({ name, value, budget });
    saveProjects(data);
    $("#projectName").value = "";
    $("#projectValue").value = "";
    render();
  };

  $("#searchInput").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    [...tbody.rows].forEach(row => {
      row.style.display = row.cells[0].textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });

  $("#exportBtn").onclick = () => {
    const data = getProjects();
    let csv = "Name, Labor, Material, Equipment, Overhead, Profit, A_Labor, A_Material, A_Equipment, A_Overhead, A_Profit\n";
    data.forEach(p => {
      const a = p.actual || {};
      csv += `${p.name},${p.budget.labor},${p.budget.material},${p.budget.equipment},${p.budget.overhead},${p.budget.profit},${a.labor||0},${a.material||0},${a.equipment||0},${a.overhead||0},${a.profit||0}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "projects.csv";
    link.click();
  };

  $("#languageSelect").onchange = () => {
    alert("Demo only: ระบบยังไม่รองรับการแปลภาษาแบบเต็มรูปแบบ");
  };

  window.updateActual = (i, field, val) => {
    const data = getProjects();
    if (!data[i].actual) data[i].actual = {};
    data[i].actual[field] = parseFloat(val) || 0;
    saveProjects(data);
    render();
  };

  window.deleteProject = i => {
    const data = getProjects();
    data.splice(i, 1);
    saveProjects(data);
    render();
  };

  render();
});
