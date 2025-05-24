import { child, get, getDatabase, ref, set, update } from "firebase/database";
import type { Dispatch, SetStateAction } from "react";
import "./firebaseConfig";
import type { ExcelDataType } from "../types";

const db = getDatabase();
const dbRef = ref(db);

function saveExcelData(excelDataList: ExcelDataType[]): void {
  excelDataList.forEach((product) => {
    const productRef = ref(db, "allproduct-price/" + product.상품코드);
    get(productRef).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("기존 데이터 있음. 덮어씌움.");
      } else {
        console.log("신규 상품. 새로 등록.");
      }
      // set(productRef, product);
    });
    set(productRef, {
      상품코드: product.상품코드,
      판매가: product.판매가,
    });
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
        // const productsData = Object.entries(snapshotVal);
        console.log(productsData);
        setProductsData(productsData);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export { saveExcelData, readData };
