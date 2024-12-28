import "./styles/MinMaxPrice.css";
import NumberInput from "./UI/numberInput/NumberInput";

const MinMaxPrice = ({ variant, value, setValue, isValid, setIsValid, minPriceValue, maxPriceValue, storeToUse }) => {
  const isMin = variant === "min";

  const inputIdName = isMin ? "min-price" : "max-price";
  const labelText = isMin ? "Min Price" : "Max price";
  const testId = isMin ? "price-category-min" : "price-category-max";

  return (
    <div className="min-max-price-wrap">
      <label htmlFor={inputIdName}>{labelText}</label>
      <NumberInput 
        type="price" 
        value={value} 
        setValue={setValue} 
        isValid={isValid} 
        setIsValid={setIsValid} 
        isMin={isMin} 
        minPriceValue={minPriceValue} 
        maxPriceValue={maxPriceValue} 
        propsStoreToUse={storeToUse}
        name={inputIdName}
        id={inputIdName}
        data-testid={testId}
      />
    </div>
  );
};

export default MinMaxPrice;
