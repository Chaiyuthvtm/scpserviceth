
function formatNumber(num) {
  return num.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const name = document.getElementById('projectName').value.trim();
  const value = parseFloat(document.getElementById('projectValue').value);

  if (!name || isNaN(value) || value <= 0) {
    alert("กรุณากรอกชื่อและมูลค่าโครงการให้ถูกต้อง");
    return;
  }

  const labor = +(value * 0.65).toFixed(2);
  const material = +(value * 0.10).toFixed(2);
  const equipment = +(value * 0.05).toFixed(2);
  const overhead = +(value * 0.10).toFixed(2);
  const profit = +(value * 0.10).toFixed(2);

  document.getElementById('nameOutput').innerText = name;
  document.getElementById('labor').innerText = formatNumber(labor);
  document.getElementById('material').innerText = formatNumber(material);
  document.getElementById('equipment').innerText = formatNumber(equipment);
  document.getElementById('overhead').innerText = formatNumber(overhead);
  document.getElementById('profit').innerText = formatNumber(profit);
  document.getElementById('result').style.display = 'block';

  const project = { name, value, labor, material, equipment, overhead, profit };

  let history = JSON.parse(localStorage.getItem('projectHistory')) || [];
  history.push(project);
  localStorage.setItem('projectHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('projectHistory')) || [];
  history.forEach((p, index) => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${formatNumber(p.value)}</td>
      <td>${formatNumber(p.labor)}</td>
      <td>${formatNumber(p.material)}</td>
      <td>${formatNumber(p.equipment)}</td>
      <td>${formatNumber(p.overhead)}</td>
      <td>${formatNumber(p.profit)}</td>
      <td><button class="delete-btn" onclick="deleteProject(${index})">ลบ</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function deleteProject(index) {
  let history = JSON.parse(localStorage.getItem('projectHistory')) || [];
  history.splice(index, 1);
  localStorage.setItem('projectHistory', JSON.stringify(history));
  renderHistory();
}

function downloadCSV() {
  const history = JSON.parse(localStorage.getItem('projectHistory')) || [];
  if (history.length === 0) {
    alert("ยังไม่มีข้อมูลให้ดาวน์โหลด");
    return;
  }
  const headers = ["ชื่อโครงการ", "มูลค่า", "ค่าแรง", "วัสดุ", "อุปกรณ์", "Overhead", "กำไร"];
  const rows = history.map(p => [p.name, p.value, p.labor, p.material, p.equipment, p.overhead, p.profit]);
  let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "project_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.onload = renderHistory;
