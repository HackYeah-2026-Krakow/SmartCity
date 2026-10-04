import { USE_MOCK } from "../config.js";
import ApiCityImpactPage from "./ApiCityImpactPage";
import CityImpactMockPage from "./CityImpactMockPage";

export default function CityImpactPage() {
  return USE_MOCK ? <CityImpactMockPage /> : <ApiCityImpactPage />;
}
