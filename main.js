
let projects = [];

function calculateBudget() {
    const name = document.getElementById('projectName').value;
    const value = parseFloat(document.getElementById('projectValue').value);
    if (!name || isNaN(value)) return alert('กรุณากรอกข้อมูลให้ครบ');

    const budget = {
        labor: value * 0.65,
        material: value * 0.10,
        equipment: value * 0.05,
        overhead: value * 0.10,
        profit: value * 0.10,
    };

    const actual = {
        labor: 0,
        material: 0,
        equipment: 0,
        overhead: 0,
        profit: 0,
    };

    const project = { name, value, budget, actual };
    projects.push(project);
    updateActualInputs(projects.length - 1);
    renderHistory();
    renderSummary();
}

function updateActualInputs(index) {
    const container = document.getElementById('actualInputs');
    container.innerHTML = '';
    ['labor', 'material', 'equipment', 'overhead', 'profit'].forEach(key => {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Actual ' + key;
        input.onchange = (e) => {
            projects[index].actual[key] = parseFloat(e.target.value) || 0;
            renderHistory();
            renderSummary();
        };
        container.appendChild(input);
    });
}

function renderHistory() {
    const history = document.getElementById('projectHistory');
    history.innerHTML = '';
    projects.forEach((proj, i) => {
        let table = '<table><thead><tr><th>ชื่อโครงการ</th><th>ประเภท</th><th>ค่าแรง</th><th>วัสดุ</th><th>อุปกรณ์</th><th>Overhead</th><th>กำไร</th><th>รวม</th><th>ลบ</th></tr></thead><tbody>';
        const budgetTotal = Object.values(proj.budget).reduce((a, b) => a + b, 0);
        const actualTotal = Object.values(proj.actual).reduce((a, b) => a + b, 0);
        table += `<tr><td rowspan="2">${proj.name}</td><td>งบประมาณ</td>` +
                 ['labor','material','equipment','overhead','profit'].map(k => `<td>${proj.budget[k].toFixed(2)}</td>`).join('') +
                 `<td>${budgetTotal.toFixed(2)}</td><td rowspan="2"><button onclick="deleteProject(${i})">ลบ</button></td></tr>`;
        table += `<tr><td>ค่าใช้จ่ายจริง</td>` +
                 ['labor','material','equipment','overhead','profit'].map(k => {
                    const color = proj.actual[k] > proj.budget[k] ? 'style="color:red"' : '';
                    return `<td ${color}>${proj.actual[k].toFixed(2)}</td>`;
                 }).join('') + `<td>${actualTotal.toFixed(2)}</td></tr>`;
        table += '</tbody></table>';
        history.innerHTML += table;
    });
}

function deleteProject(index) {
    projects.splice(index, 1);
    renderHistory();
    renderSummary();
}

function renderSummary() {
    const sum = { budget: 0, actual: 0 };
    projects.forEach(p => {
        sum.budget += Object.values(p.budget).reduce((a,b) => a+b, 0);
        sum.actual += Object.values(p.actual).reduce((a,b) => a+b, 0);
    });

    const report = document.getElementById('summaryReport');
    const color = sum.actual > sum.budget ? 'negative' : 'positive';
    report.innerHTML = `
        <table>
            <thead><tr><th>รวมงบประมาณ</th><th>รวมค่าใช้จ่ายจริง</th></tr></thead>
            <tbody><tr>
                <td>${sum.budget.toFixed(2)}</td>
                <td class="${color}">${sum.actual.toFixed(2)}</td>
            </tr></tbody>
        </table>
    `;
}
