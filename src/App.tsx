import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Home searchTerm={searchTerm} />
    </div>
  );
}

export default App;