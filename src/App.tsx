import { Box } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { IngredientesPage } from "./pages/IngredientesPage";
import { RecetasPage } from "./pages/RecetasPage";

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/ingredientes" replace />} />
        <Route path="/ingredientes" element={<IngredientesPage />} />
        <Route path="/recetas" element={<RecetasPage />} />
      </Routes>
    </Box>
  );
}

export default App;
