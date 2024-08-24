const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const userRoutes = require('./routes/userRoutes');
const taksRoutes = require('./routes/taskRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./config/swagger-output.json');

require('dotenv').config();

const cors = require('cors');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/usuario', userRoutes);
app.use('/api/tarefa', taksRoutes);


app.listen(port, async () => {
    console.log(`http://localhost:${process.env.PORT}/docs`); 
});

module.exports=app;