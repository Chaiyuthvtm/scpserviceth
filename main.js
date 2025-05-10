
document.addEventListener("DOMContentLoaded", function () {
  const budgetTotal = 100000;
  const actualTotal = 105000;

  const summaryDiv = document.getElementById("reportSummary");
  let comparisonText = "";

  if (actualTotal > budgetTotal) {
    comparisonText = `<span class='negative'>Actual (${actualTotal}) เกิน Budget (${budgetTotal})</span>`;
  } else {
    comparisonText = `<span class='positive'>Actual (${actualTotal}) น้อยกว่า Budget (${budgetTotal})</span>`;
  }

  summaryDiv.innerHTML = `
    <p><strong>ยอด Budget รวม:</strong> ${budgetTotal}</p>
    <p><strong>ยอด Actual รวม:</strong> ${actualTotal}</p>
    <p>${comparisonText}</p>
  `;

  const ctx = document.getElementById("comparisonChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Budget", "Actual"],
      datasets: [{
        label: "เปรียบเทียบยอดรวม",
        data: [budgetTotal, actualTotal],
        backgroundColor: ["green", "red"]
      }]
    }
  });
});
