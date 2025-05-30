import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  mergeExcelData,
  readData,
  saveExcelData,
} from "./firebase/firebaseDatabase";
import type { ExcelDataType, MergedProductType } from "./types";
import Category from "./Category";

// 엑셀 파일을 선택함과 동시에 데이터를 파이어베이스에 저장 ->
const ExcelReader = () => {
  const [productsData, setProductsData] = useState<MergedProductType[]>([]);
  const [filteredData, setFilteredData] = useState<MergedProductType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
      const mergedDataList = mergeExcelData(excelDataList);
      setProductsData(mergedDataList);
      setFilteredData(mergedDataList);
      saveExcelData(mergedDataList);
    };

    reader.readAsBinaryString(file);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileInput = () => {
    fileInputRef.current?.click(); // input 클릭 트리거
  };

  useEffect(() => {
    readData(setProductsData);
  }, []);

  return (
    <div>
      <div className="upload">
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
      </div>
      <Category
        productsData={productsData}
        setFilteredData={setFilteredData}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <table className="product-table">
        <thead>
          <tr>
            <th>상품 코드</th>
            <th>칼라</th>
            <th>상품 가격</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((product) => (
            <tr className="content" key={product.상품코드}>
              <td>{product.상품코드}</td>
              <td>{product.칼라.join(", ")}</td>
              <td>{product.판매가}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelReader;
