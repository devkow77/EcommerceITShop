import app from './app';
import config from './config/config';
import listEndpoints from 'express-list-endpoints';
import { randomPromotions } from './controllers/productsController'; // Importuj funkcję z właściwego pliku

// Stała, której używasz w funkcji (upewnij się, że jest dostępna)
const PROMO_DISCOUNT = 10;

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);

  // Opcjonalnie: lista endpointów
  // console.log(listEndpoints(app));

  console.log('Sprawdzanie promocji przy starcie serwera...');
  try {
    await randomPromotions();
  } catch (err) {
    console.error('Nie udało się zainicjować promocji przy starcie:', err);
  }
});
