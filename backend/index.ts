import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors'; 

const app = express();

const PORT = process.env.PORT || 2000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use('/', routes);

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Route 53 Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Route 53 Dashboard',
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
