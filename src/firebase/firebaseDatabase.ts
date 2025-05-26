import { child, get, getDatabase, ref, set } from "firebase/database";
import type { Dispatch, SetStateAction } from "react";
import "./firebaseConfig";
import type { ExcelDataType } from "../types";

const db = getDatabase();
const dbRef = ref(db);

function saveExcelData(excelDataList: ExcelDataType[]): void {
  excelDataList.forEach((product) => {
    const productRef = ref(db, "allproduct-price/" + product.상품코드);
    // get(productRef).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     console.log("기존 데이터 있음. 덮어씌움.");
    //   } else {
    //     console.log("신규 상품. 새로 등록.");
    //   }
    //   // set(productRef, product);
    // });
    const year = product.상품코드.slice(3, 5); // index 3, 4 → "24"
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
    };
    set(productRef, obj_product);
  });
}

function readData(
  setProductsData: Dispatch<SetStateAction<ExcelDataType[]>>,
  setFilteredData: Dispatch<SetStateAction<ExcelDataType[]>>
) {
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
        // setFilteredData(productsData);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export { saveExcelData, readData };
