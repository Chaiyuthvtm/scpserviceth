let projects = JSON.parse(localStorage.getItem("projects") || "[]");
function calculate() {
    const name = document.getElementById("projectName").value.trim();
    const value = parseFloat(document.getElementById("projectValue").value);
    if (!name || isNaN(value)) return;

    const labor = value * 0.65;
    const material = value * 0.10;
    const equip = value * 0.05;
    const overhead = value * 0.10;
    const profit = value * 0.10;

    projects.push({ name, value, budget: { labor, material, equip, overhead, profit }, actual: {} });
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
}

function updateActual(index) {
    const row = document.getElementById("row-" + index);
    const actual = {
        labor: parseFloat(row.querySelector(".a-labor").value) || 0,
        material: parseFloat(row.querySelector(".a-material").value) || 0,
        equip: parseFloat(row.querySelector(".a-equip").value) || 0,
        overhead: parseFloat(row.querySelector(".a-overhead").value) || 0,
        profit: parseFloat(row.querySelector(".a-profit").value) || 0,
    };
    projects[index].actual = actual;
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
}

function deleteProject(index) {
    if (confirm("Delete this project?")) {
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
        renderProjects();
    }
}

function exportCSV() {
    let csv = "Project,Budget Labor,Budget Material,Budget Equip,Budget Overhead,Budget Profit,Actual Labor,Actual Material,Actual Equip,Actual Overhead,Actual Profit\n";
    projects.forEach(p => {
        csv += [p.name, p.budget.labor, p.budget.material, p.budget.equip, p.budget.overhead, p.budget.profit,
            p.actual.labor || "", p.actual.material || "", p.actual.equip || "", p.actual.overhead || "", p.actual.profit || ""].join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
    URL.revokeObjectURL(url);
}

function renderProjects() {
    const table = document.getElementById("projectList");
    table.innerHTML = "";
    let sum = { labor: 0, material: 0, equip: 0, overhead: 0, profit: 0 };
    projects.forEach((p, i) => {
        const a = p.actual || {};
        sum.labor += a.labor || 0;
        sum.material += a.material || 0;
        sum.equip += a.equip || 0;
        sum.overhead += a.overhead || 0;
        sum.profit += a.profit || 0;
        table.innerHTML += \`
        <tr id="row-\${i}">
            <td>\${p.name}</td>
            <td>\${p.budget.labor.toFixed(2)}</td>
            <td>\${p.budget.material.toFixed(2)}</td>
            <td>\${p.budget.equip.toFixed(2)}</td>
            <td>\${p.budget.overhead.toFixed(2)}</td>
            <td>\${p.budget.profit.toFixed(2)}</td>
            <td><input class="a-labor" value="\${a.labor || ""}"/></td>
            <td><input class="a-material" value="\${a.material || ""}"/></td>
            <td><input class="a-equip" value="\${a.equip || ""}"/></td>
            <td><input class="a-overhead" value="\${a.overhead || ""}"/></td>
            <td><input class="a-profit" value="\${a.profit || ""}"/><button onclick="updateActual(\${i})">อัป</button></td>
            <td><button onclick="deleteProject(\${i})">ลบ</button></td>
        </tr>\`;
    });
    document.getElementById("actualSummary").innerHTML = \`
        ยอด Actual Cost สะสม:<br/>
        ค่าแรง: \${sum.labor.toFixed(2)}<br/>
        วัสดุสิ้นเปลือง: \${sum.material.toFixed(2)}<br/>
        อุปกรณ์ช่วย: \${sum.equip.toFixed(2)}<br/>
        Overhead: \${sum.overhead.toFixed(2)}<br/>
        กำไร: \${sum.profit.toFixed(2)}
    \`;
}

renderProjects();