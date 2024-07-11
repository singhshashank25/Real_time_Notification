const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Real-Time Notification System API',
			version: '1.0.0',
			description: 'API documentation for Real-Time Notification System',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Local server',
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				BearerAuth: [],
			},
		],
	},
	apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
