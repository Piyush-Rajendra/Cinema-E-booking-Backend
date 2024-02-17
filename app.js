// app.js

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const appRoutes = require('./Routes/appRoute');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(authRoutes);
app.use(adminRoutes);
app.use(appRoutes);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
