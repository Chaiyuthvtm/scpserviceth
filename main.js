
let projects = [];

function addProject() {
    const name = document.getElementById("projectName").value;
    const value = parseFloat(document.getElementById("projectValue").value);
    if (!name || isNaN(value)) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }
    const budget = {
        labor: value * 0.65,
        material: value * 0.10,
        equipment: value * 0.05,
        overhead: value * 0.10,
        profit: value * 0.10,
    };
    budget.total = Object.values(budget).reduce((a, b) => a + b, 0);

    const actual = {
        labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0, total: 0
    };

    projects.push({ name, value, budget, actual });
    renderProjects();
}

function updateActual(index, key, val) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
        projects[index].actual[key] = num;
        const a = projects[index].actual;
        a.total = a.labor + a.material + a.equipment + a.overhead + a.profit;
        renderProjects();
    }
}

function removeProject(index) {
    projects.splice(index, 1);
    renderProjects();
}

function renderProjects() {
    const history = document.getElementById("projectHistory");
    history.innerHTML = "<h2>ประวัติโครงการ</h2>";
    projects.forEach((p, i) => {
        let html = \`<div><strong>\${p.name}</strong> (\${p.value} บาท)
            <button onclick="removeProject(\${i})">ลบ</button>
            <table><tr><th>รายการ</th><th>งบประมาณ</th><th>ค่าใช้จ่ายจริง</th></tr>\`;
        const keys = ["labor", "material", "equipment", "overhead", "profit", "total"];
        keys.forEach(k => {
            let style = "";
            if (k !== "profit" && k !== "total" && p.actual[k] > p.budget[k]) style = "red";
            if (k === "profit" && p.actual[k] > p.budget[k]) style = "green";
            if (k === "profit" && p.actual[k] < p.budget[k]) style = "red";
            html += \`<tr>
                        <td>\${k}</td>
                        <td>\${p.budget[k].toFixed(2)}</td>
                        <td><input type="number" value="\${p.actual[k]}" 
                        onchange="updateActual(\${i}, '\${k}', this.value)" class="\${style}"></td>
                      </tr>\`;
        });
        html += "</table></div><br>";
        history.innerHTML += html;
    });

    // Summary
    const summary = document.getElementById("summaryReport");
    const totalBudget = { labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0, total: 0 };
    const totalActual = { labor: 0, material: 0, equipment: 0, overhead: 0, profit: 0, total: 0 };

    projects.forEach(p => {
        if (p.actual.total > 0) {
            for (let key in totalBudget) totalBudget[key] += p.budget[key];
            for (let key in totalActual) totalActual[key] += p.actual[key];
        }
    });

    let summaryHtml = "<h2>รายงานสรุป</h2><table><tr><th>รายการ</th><th>งบประมาณรวม</th><th>Actual รวม</th></tr>";
    for (let key in totalBudget) {
        let style = "";
        if (key !== "profit" && totalActual[key] > totalBudget[key]) style = "red";
        if (key === "profit" && totalActual[key] > totalBudget[key]) style = "green";
        if (key === "profit" && totalActual[key] < totalBudget[key]) style = "red";
        summaryHtml += \`<tr><td>\${key}</td><td>\${totalBudget[key].toFixed(2)}</td>
                         <td class="\${style}">\${totalActual[key].toFixed(2)}</td></tr>\`;
    }
    summaryHtml += "</table>";
    summary.innerHTML = summaryHtml;
}
