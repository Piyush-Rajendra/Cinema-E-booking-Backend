// app.js
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const showTimesRoutes = require('./Routes/showTimesRoutes');
const appRoutes = require('./Routes/appRoute');
const userModel = require('./models/userModel');
const adminModel = require('./models/adminModel');
const movieModel = require('./models/movieModel');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());
app.use(authRoutes);
app.use(adminRoutes);
app.use(appRoutes);
app.use(showTimesRoutes);



app.use(bodyParser.json({ limit: '100MB' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100MB' }));

userModel.createTables()
  .then(() => {
    console.log('Users table created successfully');
  })
  .catch((err) => {
    console.error('Error creating users table:', err);
  });

adminModel.createAdminsTable()
.then(()=>{
  console.log('Admin table has been created');
})
.catch ((err)=>{
    console.error('Error creating Admin Table', err);
})

movieModel.createTables()
.then(()=>{
  console.log('Table has been created');
})
.catch ((err)=>{
    console.error('Error creating Table', err);
})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});