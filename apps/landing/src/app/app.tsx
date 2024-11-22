import { Header } from "../components/header";

import { Hero } from "../components/hero";
import { Theme } from "../components/theme";

export function App() {
  return (
    <div className="font-futura bg-black text-white">
      <Header />
      <Hero />
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
