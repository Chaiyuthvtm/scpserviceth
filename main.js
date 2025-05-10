
function calculate() {
  const name = document.getElementById('projectName').value;
  const value = parseFloat(document.getElementById('projectValue').value);

  if (isNaN(value) || value <= 0) {
    alert("กรุณากรอกมูลค่าโครงการให้ถูกต้อง");
    return;
  }

  document.getElementById('nameOutput').innerText = name;
  document.getElementById('labor').innerText = (value * 0.65).toFixed(2);
  document.getElementById('material').innerText = (value * 0.10).toFixed(2);
  document.getElementById('equipment').innerText = (value * 0.05).toFixed(2);
  document.getElementById('overhead').innerText = (value * 0.10).toFixed(2);
  document.getElementById('profit').innerText = (value * 0.10).toFixed(2);

  document.getElementById('result').style.display = 'block';
}
