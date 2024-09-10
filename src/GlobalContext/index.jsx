import { createContext, useState, useEffect, useMemo } from "react";

const ContextProvider = createContext();

const ContextConsumer = ({ children }) => {
  const organizationId = "5943d4efa3d24b443f4008a2";
  const [defaultRoute, setDefaultRoute] = useState(
    sessionStorage.getItem("defaultRoute") || "Navigations"
  );
  const [activeButton, setActiveButton] = useState("Category");
  const [wayFinderDropdownOptions, setWayFinderDropdownOptions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedValue, setSelectedValue] = useState(
    wayFinderDropdownOptions?.length > 0 ? wayFinderDropdownOptions[0] : null
  );
  const [selectedCategory, setSelectedCategory] = useState({});
  const [units, setUnits] = useState([]);


  useEffect(() => {
    localStorage.setItem("Organization", organizationId);
    sessionStorage.setItem("defaultRoute", defaultRoute);
    setSelectedCategories([])
  }, [defaultRoute, organizationId]);

  const contextValue = useMemo(
    () => ({
      defaultRoute,
      setDefaultRoute,
      selectedValue,
      setSelectedValue,
      wayFinderDropdownOptions,
      setWayFinderDropdownOptions,
      selectedCategory,
      setSelectedCategory,
      activeButton,
      setActiveButton,
      selectedUnit,
      setSelectedUnit,
      selectedCategories,
      setSelectedCategories,
      selectedPath,
      setSelectedPath,
      units,
      setUnits
    }),
    [
      defaultRoute,
      selectedValue,
      wayFinderDropdownOptions,
      selectedCategory,
      activeButton,
      selectedUnit,
      selectedCategories,
      selectedPath,
      units,
    ]
  );

  return (
    <ContextProvider.Provider value={contextValue}>
      {children}
    </ContextProvider.Provider>
  );
};

export { ContextProvider, ContextConsumer };
