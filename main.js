
function formatNumber(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const value = parseFloat(document.getElementById("projectValue").value);
  if (isNaN(value)) return;

  const labor = +(value * 0.65).toFixed(2);
  const material = +(value * 0.10).toFixed(2);
  const equipment = +(value * 0.05).toFixed(2);
  const overhead = +(value * 0.10).toFixed(2);
  const profit = +(value * 0.10).toFixed(2);

  document.getElementById("budgetLabor").innerText = formatNumber(labor);
  document.getElementById("budgetMaterial").innerText = formatNumber(material);
  document.getElementById("budgetEquipment").innerText = formatNumber(equipment);
  document.getElementById("budgetOverhead").innerText = formatNumber(overhead);
  document.getElementById("budgetProfit").innerText = formatNumber(profit);

  document.getElementById("result").style.display = "block";
}

function saveProject() {
  const name = document.getElementById("projectName").value;
  const value = parseFloat(document.getElementById("projectValue").value);

  const labor = parseFloat(document.getElementById("budgetLabor").innerText.replace(/,/g, ""));
  const material = parseFloat(document.getElementById("budgetMaterial").innerText.replace(/,/g, ""));
  const equipment = parseFloat(document.getElementById("budgetEquipment").innerText.replace(/,/g, ""));
  const overhead = parseFloat(document.getElementById("budgetOverhead").innerText.replace(/,/g, ""));
  const profit = parseFloat(document.getElementById("budgetProfit").innerText.replace(/,/g, ""));

  const actualLabor = parseFloat(document.getElementById("actualLabor").value) || null;
  const actualMaterial = parseFloat(document.getElementById("actualMaterial").value) || null;
  const actualEquipment = parseFloat(document.getElementById("actualEquipment").value) || null;
  const actualOverhead = parseFloat(document.getElementById("actualOverhead").value) || null;
  const actualProfit = parseFloat(document.getElementById("actualProfit").value) || null;

  const data = {
    name, value,
    labor, material, equipment, overhead, profit,
    actualLabor, actualMaterial, actualEquipment, actualOverhead, actualProfit
  };

  let history = JSON.parse(localStorage.getItem("projectHistory") || "[]");
  history.push(data);
  localStorage.setItem("projectHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("projectHistory") || "[]");
  const container = document.getElementById("history");
  container.innerHTML = "";
  history.forEach((p, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${p.name}</strong><br/>
      มูลค่า: ${formatNumber(p.value)} บาท<br/>
      งบประมาณ - ค่าแรง: ${formatNumber(p.labor)}, วัสดุ: ${formatNumber(p.material)}, อุปกรณ์: ${formatNumber(p.equipment)}, Overhead: ${formatNumber(p.overhead)}, กำไร: ${formatNumber(p.profit)}<br/>
      Actual - ค่าแรง: ${p.actualLabor ?? "-"}, วัสดุ: ${p.actualMaterial ?? "-"}, อุปกรณ์: ${p.actualEquipment ?? "-"}, Overhead: ${p.actualOverhead ?? "-"}, กำไร: ${p.actualProfit ?? "-"}<br/><hr/>`;
    container.appendChild(div);
  });
}

window.onload = renderHistory;
