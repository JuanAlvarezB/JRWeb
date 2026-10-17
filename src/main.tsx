import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { createContainer } from './di/container';
import { createQueryClient } from './presentation/providers/queryClient';
import { restoreQueryState } from './presentation/providers/queryState';
import './styles/fonts.css';
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('No se encontró el elemento #root en index.html.');
}

// QA y PDN llegan prerenderizados: se hidrata con la caché de consultas del build.
// En DEV (`npm run dev`) no hay prerender y la aplicación se monta desde cero.
const queryClient = createQueryClient();
restoreQueryState(queryClient);

const app = (
  <StrictMode>
    <App dependencies={createContainer()} queryClient={queryClient} />
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
