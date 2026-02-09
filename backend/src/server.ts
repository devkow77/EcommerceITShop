import app from './app';
import config from './config/config';
import { handleDailyPromotions, handleHotShotRotation } from './controllers/productsController';

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);
  console.log('Sprawdzanie promocji przy starcie serwera...');
  try {
    await handleDailyPromotions();
  } catch (err) {
    console.error('Nie udało się zainicjować promocji przy starcie:', err);
  }

  console.log('Inicjalizacja Hot Shot przy starcie serwera...');
  try {
    await handleHotShotRotation();
  } catch (err) {
    console.error('Nie udało się zainicjować Hot Shot przy starcie:', err);
  }

  setInterval(async () => {
    try {
      console.log('[Scheduler] Uruchamianie rotacji Hot Shot...');
      await handleHotShotRotation();
    } catch (err) {
      console.error('[Scheduler] Błąd w rotacji Hot Shot:', err);
    }
  }, 12 * 60 * 60 * 1000); // 12 godzin

});
