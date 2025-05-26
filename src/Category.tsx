import { useState, type Dispatch, type SetStateAction } from "react";
import type { ExcelDataType } from "./types";
import { readData } from "./firebase/firebaseDatabase";

type CategoryProps = {
  productsData: ExcelDataType[];
  setProductsData: Dispatch<SetStateAction<ExcelDataType[]>>;
};

const categoryMap: Record<string, string> = {
  "1": "자켓",
  "2": "상의",
  "3": "하의",
  "4": "셔츠",
  "5": "패딩",
  X: "키즈",
  acc: "악세사리",
};

const getCategory = (code: string): string => {
  const category = code.charAt(1) === "X" ? "X" : code.charAt(5); // index 5 → "2"
  if (category === "X") return "kids";
  if (["1", "2", "3", "4", "5"].includes(category)) return category;
  return "악세사리";
};

const Category: React.FC<CategoryProps> = ({
  productsData,
  setProductsData,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("상의");

  const handleFilter = (categoryValue: string) => {
    const selectedCategory = categoryValue;
    setActiveCategory(selectedCategory);
    // const filtered = productsData.filter(
    //   (product) => product.category === selectedCategory
    // );
    // setProductsData(filtered);
  };
  console.log(activeCategory);
  //   console.log(Object.keys(categoryMap));
  return (
    <div className="controls">
      <div className="category-buttons">
        {Object.keys(categoryMap).map((categoryKey) => (
          <button
            key={categoryKey}
            onClick={() => handleFilter(categoryMap[categoryKey])}
            className={`
              ${activeCategory === categoryMap[categoryKey] ? "active" : ""}
            `}
          >
            {categoryMap[categoryKey]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
