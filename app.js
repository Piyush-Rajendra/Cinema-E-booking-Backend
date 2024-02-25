// app.js
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const appRoutes = require('./Routes/appRoute');

const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());
app.use(authRoutes);
app.use(adminRoutes);
app.use(appRoutes);

// Increase payload size limit to 10MB (adjust as needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));



app.listen(port, () => {
  console.log('Server is running on http://localhost:${port}');
});