async function loadExcel() {
    // تحميل ملف Excel من Google Sheets بصيغة xlsx
    const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRiOZ5Lcl6E2KNqtqssT7X0XV6Jmvd6bltFj2HxT6nsBLNDMuj-8Kjb-VK4OGZoLQ/pub?output=xlsx");
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // تحويل محتوى الورقة إلى صيغة JSON
    window.excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    displayExcel(window.excelData);
}

function displayExcel(data) {
    const headerRow = document.getElementById("tableHeader");
    const body = document.getElementById("tableBody");

    // مسح المحتوى السابق للجدول
    headerRow.innerHTML = "";
    body.innerHTML = "";

    // عرض ترويسة الجدول
    data[0].forEach(header => {
        const th = document.createElement("th");
        th.innerText = header;
        headerRow.appendChild(th);
    });

    // عرض البيانات
    data.slice(1).forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.innerText = cell;
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
}

async function searchExcel() {
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
    if (!searchValue) return;

    const result = [];
    window.excelData.forEach((row, index) => {
        if (index !== 0 && row[0] && row[0].toString().toLowerCase().includes(searchValue)) {
            result.push(row);
        }
    });

    if (result.length === 0) {
        alert('الاسم غير موجود.');
    } else {
        displayExcel([window.excelData[0], ...result]);
    }
}

// تحميل البيانات عند تحميل الصفحة
window.onload = loadExcel;
