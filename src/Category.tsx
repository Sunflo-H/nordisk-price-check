import { type Dispatch, type SetStateAction } from "react";
import type { ExcelDataType } from "./types";

type CategoryProps = {
  productsData: ExcelDataType[];
  activeCategory: string;
  setFilteredData: Dispatch<SetStateAction<ExcelDataType[]>>;
  setActiveCategory: Dispatch<SetStateAction<string>>;
};

// const categoryMap: Record<string, string> = {
//   "1": "자켓",
//   "2": "상의",
//   "3": "하의",
//   "4": "셔츠",
//   "5": "패딩",
//   X: "키즈",
//   acc: "악세사리",
// };

const categoryMap: Record<string, string> = {
  "1": "자켓",
  "2": "상의",
  "3": "하의",
  "4": "셔츠",
  "5": "패딩",
  X: "키즈",
  acc: "악세사리",
};

const Category: React.FC<CategoryProps> = ({
  productsData,
  activeCategory,
  setFilteredData,
  setActiveCategory,
}) => {
  const handleFilter = (categoryKey: string) => {
    const selectedCategory = categoryMap[categoryKey];
    setActiveCategory(selectedCategory);

    const filtered = productsData.filter(
      (product) => product.category === categoryKey
    );

    setFilteredData(filtered);
  };

  return (
    <div className="controls">
      {/* <div className="category-buttons">
        {Object.keys(categoryMap).map((categoryKey) => (
          <button
            key={categoryKey}
            onClick={() => handleFilter(categoryKey)}
            className={`
              ${activeCategory === categoryMap[categoryKey] ? "active" : ""}
            `}
          >
            {categoryMap[categoryKey]}
          </button>
        ))}
      </div> */}
      <div className="category-buttons">
        {Object.keys(categoryMap).map((categoryKey) => (
          <button
            key={categoryKey}
            onClick={() => handleFilter(categoryKey)}
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
