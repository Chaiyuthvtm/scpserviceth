
// JavaScript simplified logic (main.js content placeholder)
let projects = JSON.parse(localStorage.getItem("projects")) || [];
function calculateBudget() {
    const name = document.getElementById("projectName").value;
    const value = parseFloat(document.getElementById("projectValue").value);
    if (!name || isNaN(value)) return alert("Please enter valid data");
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
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
    renderChart();
}
function renderProjects() {
    const container = document.getElementById("projectHistory");
    container.innerHTML = "<table class='table-auto w-full text-left'><thead><tr><th>Project</th><th colspan='5'>Budget</th><th colspan='5'>Actual</th><th>Actions</th></tr></thead><tbody>";
    projects.forEach((p, i) => {
        container.innerHTML += `<tr>
            <td>${p.name}</td>
            <td>${p.budget.labor.toFixed(2)}</td><td>${p.budget.material.toFixed(2)}</td>
            <td>${p.budget.equip.toFixed(2)}</td><td>${p.budget.overhead.toFixed(2)}</td><td>${p.budget.profit.toFixed(2)}</td>
            <td><input type='number' value='${p.actual.labor}' onchange='updateActual(${i}, "labor", this.value)'/></td>
            <td><input type='number' value='${p.actual.material}' onchange='updateActual(${i}, "material", this.value)'/></td>
            <td><input type='number' value='${p.actual.equip}' onchange='updateActual(${i}, "equip", this.value)'/></td>
            <td><input type='number' value='${p.actual.overhead}' onchange='updateActual(${i}, "overhead", this.value)'/></td>
            <td><input type='number' value='${p.actual.profit}' onchange='updateActual(${i}, "profit", this.value)'/></td>
            <td><button onclick='deleteProject(${i})'>Delete</button></td>
        </tr>`;
    });
    container.innerHTML += "</tbody></table>";
}
function updateActual(i, key, val) {
    projects[i].actual[key] = parseFloat(val) || 0;
    localStorage.setItem("projects", JSON.stringify(projects));
    renderChart();
}
function deleteProject(i) {
    projects.splice(i, 1);
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
    renderChart();
}
function renderChart() {
    const total = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };
    projects.forEach(p => {
        total.labor += p.actual.labor;
        total.material += p.actual.material;
        total.equip += p.actual.equip;
        total.overhead += p.actual.overhead;
        total.profit += p.actual.profit;
    });
    const ctx = document.getElementById("actualChart").getContext("2d");
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Labor", "Material", "Equip", "Overhead", "Profit"],
            datasets: [{
                label: "Actual Cost",
                data: [total.labor, total.material, total.equip, total.overhead, total.profit],
                backgroundColor: "rgba(54, 162, 235, 0.5)"
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    document.getElementById("actualSummary").innerText = 
        `ยอด Actual Cost สะสม\nค่าแรง: ${total.labor.toFixed(2)}, วัสดุ: ${total.material.toFixed(2)}, อุปกรณ์: ${total.equip.toFixed(2)}, Overhead: ${total.overhead.toFixed(2)}, กำไร: ${total.profit.toFixed(2)}`;
}
function filterProjects() {
    const filter = document.getElementById("searchInput").value.toLowerCase();
    projects = JSON.parse(localStorage.getItem("projects")) || [];
    if (filter) {
        projects = projects.filter(p => p.name.toLowerCase().includes(filter));
    }
    renderProjects();
}
renderProjects();
renderChart();
