
document.addEventListener("DOMContentLoaded", () => {
    const calculateBtn = document.getElementById("calculateBtn");
    const projectNameInput = document.getElementById("projectName");
    const projectValueInput = document.getElementById("projectValue");
    const resultDiv = document.getElementById("result");
    const historyTable = document.getElementById("historyTable").querySelector("tbody");

    function format(num) {
        return Number(num).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function loadHistory() {
        const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        historyTable.innerHTML = "";
        data.forEach((item, index) => {
            const row = historyTable.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${format(item.value)}</td>
                <td>${format(item.labor)}</td>
                <td>${format(item.material)}</td>
                <td>${format(item.equipment)}</td>
                <td>${format(item.overhead)}</td>
                <td>${format(item.profit)}</td>
                <td><button onclick="deleteProject(${index})">ลบ</button></td>
            `;
        });
    }

    window.deleteProject = function(index) {
        const data = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        data.splice(index, 1);
        localStorage.setItem("projectHistory", JSON.stringify(data));
        loadHistory();
    };

    calculateBtn.addEventListener("click", () => {
        const name = projectNameInput.value.trim();
        const value = parseFloat(projectValueInput.value);
        if (!name || isNaN(value)) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const labor = value * 0.65;
        const material = value * 0.10;
        const equipment = value * 0.05;
        const overhead = value * 0.10;
        const profit = value * 0.10;

        resultDiv.innerHTML = `
            <p>ค่าแรง: ${format(labor)}</p>
            <p>วัสดุสิ้นเปลือง: ${format(material)}</p>
            <p>อุปกรณ์ช่วย: ${format(equipment)}</p>
            <p>Overhead: ${format(overhead)}</p>
            <p>กำไร: ${format(profit)}</p>
        `;

        const history = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        history.push({ name, value, labor, material, equipment, overhead, profit });
        localStorage.setItem("projectHistory", JSON.stringify(history));
        loadHistory();
    });

    loadHistory();
});
