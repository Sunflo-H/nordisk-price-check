import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { readData, saveExcelData } from "./firebase/firebaseDatabase";
import type { ExcelDataType } from "./types";

// 엑셀 파일을 선택함과 동시에 데이터를 파이어베이스에 저장 ->
const ExcelReader = () => {
  const [productsData, setProductsData] = useState<ExcelDataType[]>([]);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (evt: ProgressEvent<FileReader>) => {
      const binaryStr = evt.target?.result;
      if (typeof binaryStr !== "string") return;

      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelDataList = XLSX.utils
        .sheet_to_json(sheet)
        .splice(1) as ExcelDataType[];
      setProductsData(excelDataList);
      saveExcelData(excelDataList);
    };

    reader.readAsBinaryString(file);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileInput = () => {
    fileInputRef.current?.click(); // input 클릭 트리거
  };

  useEffect(() => {
    readData(setProductsData);
  }, [productsData]);
  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <div
        onClick={handleFileInput}
        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
      >
        엑셀 파일 업로드
      </div>
      <div>==========================================</div>
      <div>
        {productsData.map((product) => (
          <table key={product.상품코드}>
            <tr className="content">
              <td>{product.상품코드}</td>
              // fs에 저장할 때 판매가로 안하고 가격으로 저장해서 생기는 문제야
              // 일관성있게 판매가로 통합시키자.
              <td>{product.판매가}</td>
            </tr>
          </table>
        ))}
      </div>
    </div>
  );
};

export default ExcelReader;
