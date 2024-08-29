import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Header from "./pages/header";
import Navigation from "./pages/navigation";
import Amenities from "./pages/amenities";
import CustomerSupport from "./pages/customerSupport";
import ShopFinder from "./pages/shopFinder";
import Offers from "./pages/shopFinder/offers";
import Shops from "./pages/shopFinder/shops";
import ShopDetails from "./pages/shopFinder/shopDetails";
import Events, { EventsCard } from "./pages/events";
import Event from "./pages/events/EventsCard";
import NavigationShop from "./pages/navigation/shop";

const RoutesComponent = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path=":id" element={<Header />}>
        <Route index element={<Navigation />} />
        <Route path="navigation" element={<Navigation />} />
        <Route path="amenities" element={<Amenities />} />
        <Route path="customer-services" element={<CustomerSupport />} />
        <Route path="shop-finder" element={<ShopFinder />} />
        <Route path="offers" element={<Offers />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:id" element={<ShopDetails />} />
        <Route path="events" element={<Events />} />
        <Route path="events/allEvents" element={<Event />} />
        <Route path="navigation/shops" element={<NavigationShop />} />
      </Route>
    )
  );

  return router;
};

export default RoutesComponent;
