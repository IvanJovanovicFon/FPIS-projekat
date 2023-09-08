const express = require('express');
const apiRoutes = require('./Routes/api'); 
const cors = require('cors'); 
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'POST,GET,HEAD,PUT,PATCH,DELETE',
  credentials: true,
}));
app.use('/api', apiRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});