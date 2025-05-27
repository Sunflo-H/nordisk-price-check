import { child, get, getDatabase, ref, set } from "firebase/database";
import type { Dispatch, SetStateAction } from "react";
import "./firebaseConfig";
import type { ExcelDataType, MergedProductType } from "../types";

const db = getDatabase();
const dbRef = ref(db);

function saveExcelData(excelDataList: ExcelDataType[]): void {
  const mergedDataList = mergeExcelData(excelDataList);
  mergedDataList.forEach((product) => {
    const productRef = ref(db, "allproduct-price/" + product.상품코드);
    const year = product.상품코드.slice(3, 5); // index 3, 4 → "24"
    if (year !== "24") return;

    const getCategory = (code: string): string => {
      const category = code.charAt(1) === "X" ? "X" : code.charAt(5); // index 5 → "2"
      if (["1", "2", "3", "4", "5", "X"].includes(category)) return category;
      return "acc";
    };
    const category = getCategory(product.상품코드);

    const obj_product = {
      상품코드: product.상품코드,
      판매가: product.판매가,
      year,
      category,
      칼라: product.칼라,
    };
    set(productRef, obj_product);
  });
}

function readData(setProductsData: Dispatch<SetStateAction<ExcelDataType[]>>) {
  get(child(dbRef, `allproduct-price`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const snapshotVal = snapshot.val() as Record<
          string,
          Omit<ExcelDataType, "상품코드">
        >;
        const productsData: ExcelDataType[] = Object.entries(snapshotVal).map(
          ([상품코드, item]) => ({
            상품코드,
            ...item,
          })
        );
        setProductsData(productsData);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function mergeExcelData(excelRows: ExcelDataType[]): MergedProductType[] {
  const productMap = new Map<string, MergedProductType>();

  excelRows.forEach((row) => {
    const existing = productMap.get(row.상품코드);

    if (existing) {
      // 기존에 존재하는 경우: color만 추가
      if (!existing.칼라.includes(row.칼라)) {
        existing.칼라.push(row.칼라);
      }
    } else {
      // 처음 나오는 경우: 객체 새로 만들고 color를 배열로
      const { 칼라, ...rest } = row;
      productMap.set(row.상품코드, {
        ...rest,
        칼라: [칼라],
      });
    }
  });

  const result = Array.from(productMap.values());
  return result;
}

export { saveExcelData, readData };
