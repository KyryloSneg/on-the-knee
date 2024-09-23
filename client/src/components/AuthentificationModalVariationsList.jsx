import "./styles/AuthentificationModalVariationsList.css";
import StringActions from "../utils/StringActions";
import UIButton from "./UI/uiButton/UIButton";

const AuthentificationModalVariationsList = ({ selectedVariation, setSelectedVariation, variations }) => {
  const variationsToRender = variations.filter(variation => selectedVariation !== variation);

  function onClick(variation) {
    setSelectedVariation(variation);
  }

  return (
    <ul className="authentification-modal-variations-list">
      {variationsToRender.map(variation => 
        <li key={variation}>
          <UIButton
            variant="primary3" 
            className="authentification-modal-variation"
            onClick={() => onClick(variation)}
          >
            {StringActions.capitalize(StringActions.splitByUpperCaseLetters(variation))}
          </UIButton>
        </li>
      )}
    </ul>
  );
}

export default AuthentificationModalVariationsList;
