
document.getElementById("calculateBtn").addEventListener("click", calculate);

function calculate() {
  const projectValue = parseFloat(document.getElementById("projectValue").value);
  if (isNaN(projectValue)) return;

  const labor = projectValue * 0.65;
  const material = projectValue * 0.10;
  const equip = projectValue * 0.05;
  const overhead = projectValue * 0.10;
  const profit = projectValue * 0.10;

  const ctx = document.getElementById('actualChart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Labor', 'Material', 'Equip', 'Overhead', 'Profit'],
      datasets: [{
        label: 'Calculated Budget',
        data: [labor, material, equip, overhead, profit],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
