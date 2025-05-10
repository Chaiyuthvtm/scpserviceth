
function formatNumber(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const value = parseFloat(document.getElementById("projectValue").value);
  if (isNaN(value)) return;

  document.getElementById("budgetLabor").innerText = formatNumber(value * 0.65);
  document.getElementById("budgetMaterial").innerText = formatNumber(value * 0.10);
  document.getElementById("budgetEquipment").innerText = formatNumber(value * 0.05);
  document.getElementById("budgetOverhead").innerText = formatNumber(value * 0.10);
  document.getElementById("budgetProfit").innerText = formatNumber(value * 0.10);

  document.getElementById("result").style.display = "block";
}

function saveProject() {
  const name = document.getElementById("projectName").value;
  const value = parseFloat(document.getElementById("projectValue").value);

  const data = {
    name,
    value,
    labor: parseFloat(document.getElementById("budgetLabor").innerText.replace(/,/g, "")),
    material: parseFloat(document.getElementById("budgetMaterial").innerText.replace(/,/g, "")),
    equipment: parseFloat(document.getElementById("budgetEquipment").innerText.replace(/,/g, "")),
    overhead: parseFloat(document.getElementById("budgetOverhead").innerText.replace(/,/g, "")),
    profit: parseFloat(document.getElementById("budgetProfit").innerText.replace(/,/g, "")),
    actualLabor: parseFloat(document.getElementById("actualLabor").value) || 0,
    actualMaterial: parseFloat(document.getElementById("actualMaterial").value) || 0,
    actualEquipment: parseFloat(document.getElementById("actualEquipment").value) || 0,
    actualOverhead: parseFloat(document.getElementById("actualOverhead").value) || 0,
    actualProfit: parseFloat(document.getElementById("actualProfit").value) || 0
  };

  let history = JSON.parse(localStorage.getItem("projectHistory") || "[]");
  history.push(data);
  localStorage.setItem("projectHistory", JSON.stringify(history));
  renderHistory();
}


function renderHistory() {
  updateSummary();

  let history = JSON.parse(localStorage.getItem("projectHistory") || "[]");
  const container = document.getElementById("history");
  container.innerHTML = "";
  history.forEach(p => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <strong>${p.name}</strong><br/>
      มูลค่า: ${formatNumber(p.value)} บาท<br/>
      <u>งบประมาณ:</u><br/>
      - ค่าแรง: ${formatNumber(p.labor)}<br/>
      - วัสดุ: ${formatNumber(p.material)}<br/>
      - อุปกรณ์: ${formatNumber(p.equipment)}<br/>
      - Overhead: ${formatNumber(p.overhead)}<br/>
      - กำไร: ${formatNumber(p.profit)}<br/>
      <u>Actual:</u><br/>
      - ค่าแรง: ${formatNumber(p.actualLabor)}<br/>
      - วัสดุ: ${formatNumber(p.actualMaterial)}<br/>
      - อุปกรณ์: ${formatNumber(p.actualEquipment)}<br/>
      - Overhead: ${formatNumber(p.actualOverhead)}<br/>
      - กำไร: ${formatNumber(p.actualProfit)}<br/>
    `;
    container.appendChild(div);
  });
}

window.onload = renderHistory;

function updateSummary() {
  let history = JSON.parse(localStorage.getItem("projectHistory") || "[]");
  let totalLabor = 0, totalMaterial = 0, totalEquipment = 0, totalOverhead = 0, totalProfit = 0;
  history.forEach(p => {
    totalLabor += p.actualLabor || 0;
    totalMaterial += p.actualMaterial || 0;
    totalEquipment += p.actualEquipment || 0;
    totalOverhead += p.actualOverhead || 0;
    totalProfit += p.actualProfit || 0;
  });
  document.getElementById("totalLabor").innerText = formatNumber(totalLabor);
  document.getElementById("totalMaterial").innerText = formatNumber(totalMaterial);
  document.getElementById("totalEquipment").innerText = formatNumber(totalEquipment);
  document.getElementById("totalOverhead").innerText = formatNumber(totalOverhead);
  document.getElementById("totalProfit").innerText = formatNumber(totalProfit);
}
