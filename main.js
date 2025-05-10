
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
  document.getElementById('labor').innerText = labor;
  document.getElementById('material').innerText = material;
  document.getElementById('equipment').innerText = equipment;
  document.getElementById('overhead').innerText = overhead;
  document.getElementById('profit').innerText = profit;
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
  history.forEach(p => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${p.value}</td>
      <td>${p.labor}</td>
      <td>${p.material}</td>
      <td>${p.equipment}</td>
      <td>${p.overhead}</td>
      <td>${p.profit}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
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
