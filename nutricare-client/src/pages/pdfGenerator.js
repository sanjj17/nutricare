import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Format snake_case → Title Case (e.g. 'weight_loss' → 'Weight Loss')
const formatList = (list) => {
  if (!Array.isArray(list)) return '';
  return list.map(item =>
    item
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  ).join(', ');
};

export const generatePDFReport = (userData, meals) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("NutriCare - Weekly Health & Meal Report", 20, 20);
  doc.setFontSize(12);

  let y = 30;

  // ✅ User Profile Info
  if (userData) {
    doc.text(`Name: ${userData.name}`, 20, y); y += 10;
    doc.text(`Email: ${userData.email}`, 20, y); y += 10;
    doc.text(`Age: ${userData.age}`, 20, y); y += 10;
    doc.text(`Weight: ${userData.weight}`, 20, y); y += 10;
    doc.text(`Gender: ${userData.gender}`, 20, y); y += 10;
    doc.text(`Health Conditions: ${formatList(userData.conditions)}`, 20, y); y += 10;
    doc.text(`Goals: ${formatList(userData.goals)}`, 20, y); y += 10;
  }

  y += 10;

  // ✅ Weekly Meal Plan Table
  if (meals && meals.length > 0) {
    const tableData = meals.map((meal, idx) => [
      idx + 1,
      meal.day || "-",
      meal.breakfast || "-",
      meal.lunch || "-",
      meal.dinner || "-",
      meal.snacks || "-"
    ]);

    autoTable(doc, {
      head: [["#", "Day", "Breakfast", "Lunch", "Dinner","Snacks"]],
      body: tableData,
      startY: y
    });

    // ✅ After autoTable, update y to footer
    const finalY = doc.lastAutoTable.finalY || y + 10;

    // ✅ Footer: Date
    const dateStr = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Report generated on: ${dateStr}`, 10, doc.internal.pageSize.height - 10);
  } else {
    doc.text("No meal data available.", 20, y);
  }

  // ✅ Save the PDF
  doc.save("NutriCare_Weekly_Report.pdf");
};
