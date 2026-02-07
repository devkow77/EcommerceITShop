import app from './app';
import config from './config/config';
import { handleDailyPromotions } from './controllers/productsController';

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);
  console.log('Sprawdzanie promocji przy starcie serwera...');
  try {
    await handleDailyPromotions();
  } catch (err) {
    console.error('Nie udało się zainicjować promocji przy starcie:', err);
  }
});
