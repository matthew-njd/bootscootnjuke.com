import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Owners from "./pages/Owners";
import OwnerStats from "./pages/OwnerStats";
import Matchups from "./pages/Matchups";
import Leaderboards from "./pages/Leaderboards";
import Drafts from "./pages/Drafts";
import "./app.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/owners/:ownerId/stats" element={<OwnerStats />} />
          <Route path="/matchups" element={<Matchups />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/drafts" element={<Drafts />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
