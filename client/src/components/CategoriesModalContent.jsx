import { useContext } from "react";
import { Context } from "../Context";
import CategoriesModalItem from "./CategoriesModalItem";
import { observer } from "mobx-react-lite";
import "./styles/CategoriesModalContent.css";
import Loader from "./UI/loader/Loader";

const CategoriesModalContent = observer(() => {
  const { deviceStore } = useContext(Context);
  const mainCategories = deviceStore.categories.filter(category => category.treeParentCategoriesIds === null);

  return (
    <section className="categories-modal-content">
      {mainCategories
        ? (
          <ul className="categories-modal-content-list">
            {mainCategories.map(category =>
              <li key={category.id}>
                <CategoriesModalItem category={category} />
              </li>
            )}
          </ul>
        )
        : <Loader />
      }
    </section>
  );
});

export default CategoriesModalContent;
