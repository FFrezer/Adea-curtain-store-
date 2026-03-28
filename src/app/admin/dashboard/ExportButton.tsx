"use client";

import * as XLSX from "xlsx";

export default function ExportButton({ orders }: any) {
  const exportToExcel = () => {
    const data = orders.map((o: any) => ({
      Customer: o.customerName,
      Branch: o.branch,
      Total: o.total,
      Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    XLSX.writeFile(wb, "orders.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Export Excel
    </button>
  );
}