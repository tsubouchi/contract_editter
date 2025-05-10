import './styles/index.css';
import { DropZone } from './components/DropZone';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;
  app.appendChild(DropZone());
}); 