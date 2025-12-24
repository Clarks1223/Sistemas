import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { FinancialProvider } from './context/FinancialContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { StructureC04 } from './pages/StructureC04';
import { StructureI01 } from './pages/StructureI01';
import { StructureI02 } from './pages/StructureI02';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FinancialProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="c04" element={<StructureC04 />} />
              <Route path="i01" element={<StructureI01 />} />
              <Route path="i02" element={<StructureI02 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FinancialProvider>
    </ThemeProvider>
  );
}

export default App;
