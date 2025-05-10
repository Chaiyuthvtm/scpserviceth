
document.addEventListener("DOMContentLoaded", () => {
  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  window.calculateBudget = function () {
    const name = document.getElementById("projectName").value;
    const value = parseFloat(document.getElementById("projectValue").value);
    if (!name || isNaN(value)) return alert("Please enter valid data");

    const labor = value * 0.65;
    const material = value * 0.10;
    const equip = value * 0.05;
    const overhead = value * 0.10;
    const profit = value * 0.10;

    const project = {
      id: Date.now(),
      name,
      value,
      budget: { labor, material, equip, overhead, profit },
      actual: { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 }
    };

    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
    renderChart();
  };

  window.updateActual = function (id) {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;

    proj.actual.labor = parseFloat(document.getElementById(`actual-labor-${id}`).value) || 0;
    proj.actual.material = parseFloat(document.getElementById(`actual-material-${id}`).value) || 0;
    proj.actual.equip = parseFloat(document.getElementById(`actual-equip-${id}`).value) || 0;
    proj.actual.overhead = parseFloat(document.getElementById(`actual-overhead-${id}`).value) || 0;
    proj.actual.profit = parseFloat(document.getElementById(`actual-profit-${id}`).value) || 0;

    localStorage.setItem("projects", JSON.stringify(projects));
    renderChart();
  };

  window.deleteProject = function (id) {
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
    renderChart();
  };

  function renderProjects() {
    const container = document.getElementById("projectHistory");
    if (!container) return;
    container.innerHTML = `
      <table class="table-auto w-full border text-sm">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-2 py-1">Project</th>
            <th class="border px-2 py-1">Value</th>
            <th class="border px-2 py-1">Labor</th>
            <th class="border px-2 py-1">Material</th>
            <th class="border px-2 py-1">Equip</th>
            <th class="border px-2 py-1">Overhead</th>
            <th class="border px-2 py-1">Profit</th>
            <th class="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(p => `
            <tr class="bg-white">
              <td class="border px-2 py-1" rowspan="2">${p.name}</td>
              <td class="border px-2 py-1" rowspan="2">${p.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td class="border px-2 py-1">${p.budget.labor.toFixed(2)}</td>
              <td class="border px-2 py-1">${p.budget.material.toFixed(2)}</td>
              <td class="border px-2 py-1">${p.budget.equip.toFixed(2)}</td>
              <td class="border px-2 py-1">${p.budget.overhead.toFixed(2)}</td>
              <td class="border px-2 py-1">${p.budget.profit.toFixed(2)}</td>
              <td class="border px-2 py-1" rowspan="2">
                <button onclick="deleteProject(${p.id})" class="text-red-600">🗑</button>
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border px-2 py-1"><input id="actual-labor-${p.id}" type="number" value="${p.actual.labor}" class="w-full border p-1" /></td>
              <td class="border px-2 py-1"><input id="actual-material-${p.id}" type="number" value="${p.actual.material}" class="w-full border p-1" /></td>
              <td class="border px-2 py-1"><input id="actual-equip-${p.id}" type="number" value="${p.actual.equip}" class="w-full border p-1" /></td>
              <td class="border px-2 py-1"><input id="actual-overhead-${p.id}" type="number" value="${p.actual.overhead}" class="w-full border p-1" /></td>
              <td class="border px-2 py-1"><input id="actual-profit-${p.id}" type="number" value="${p.actual.profit}" class="w-full border p-1" /></td>
              <td class="border px-2 py-1 text-center"><button onclick="updateActual(${p.id})" class="text-blue-600">💾</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderChart() {
    const ctx = document.getElementById('actualChart').getContext('2d');
    const data = projects.map(p => Object.values(p.actual).reduce((a, b) => a + b, 0));
    const labels = projects.map(p => p.name);

    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Actual Total',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  renderProjects();
  renderChart();
});
