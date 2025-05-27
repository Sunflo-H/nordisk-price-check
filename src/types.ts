export type ExcelDataType = {
  상품코드: string;
  상품명: string;
  판매가: number;
  year: string;
  category: string;
  칼라: string;
};

export type MergedProductType = Omit<ExcelDataType, "칼라"> & {
  칼라: string[];
};
// export type FinalDataType = {
//   상품코드: string;
//   상품명: string;
//   판매가: number;
//   year: string;
//   category: string;
//   칼라: string[];
// };
