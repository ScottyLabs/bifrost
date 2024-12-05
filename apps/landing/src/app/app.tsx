import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Theme } from "../components/theme";
import { Desc } from "../components/desc";

export function App() {
  return (
    <div className="font-sfpro bg-gradient text-white">
      <Header />
      <Hero />
      <Desc />
      <Theme />

      {/* <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{" "}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes> */}
    </div>
  );
}

export default App;
