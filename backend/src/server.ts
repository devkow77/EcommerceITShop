import app from './app';
import config from './config/config';
import listEndpoints from 'express-list-endpoints';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(listEndpoints(app));
});
