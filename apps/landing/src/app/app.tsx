import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Theme } from "../components/theme";
import { Desc } from "../components/desc";
import { Schedule } from "../components/schedule";
import { Speakers } from "../components/speakers";
import { Prizes } from "../components/prizes";

export function App() {
  return (
    <div className="font-sfpro bg-gradient text-white">
      <Header />
      <Hero />
      <Desc />
      <Theme />
      <Schedule />
      <Speakers />
      <Prizes />
    </div>
  );
}

export default App;
