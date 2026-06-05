export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Login API',
    version: '1.0.0',
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Returns JWT token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
      '/auth/me': {
        get: {
          summary: 'Get current user info',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Returns logged in user' },
            401: { description: 'No token or invalid token' },
          },
        },
      },
      '/posts': {
        get: {
          summary: 'Get all posts',
          responses: {
            200: { description: 'Returns all posts' },
          },
        },
        post: {
          summary: 'Create a post',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Post created' },
            401: { description: 'Not logged in' },
          },
        },
      },
      '/posts/{id}': {
        get: {
          summary: 'Get a single post',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Returns the post' },
            404: { description: 'Post not found' },
          },
        },
        put: {
          summary: 'Update a post',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Post updated' },
            401: { description: 'Not logged in' },
            403: { description: 'Not your post' },
            404: { description: 'Post not found' },
          },
        },
        delete: {
          summary: 'Delete a post',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Post deleted' },
            401: { description: 'Not logged in' },
            403: { description: 'Not your post' },
            404: { description: 'Post not found' },
          },
        },
      },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};