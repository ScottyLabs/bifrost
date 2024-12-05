import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Theme } from "../components/theme";
import { Desc } from "../components/desc";
import { Schedule } from "../components/schedule";

export function App() {
  return (
    <div className="font-sfpro bg-gradient text-white">
      <Header />
      <Hero />
      <Desc />
      <Theme />
      <Schedule />
    </div>
  );
}

export default App;
