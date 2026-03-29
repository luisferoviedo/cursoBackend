// Especificación OpenAPI local.
// La mantenemos en un objeto JS para evitar que una dependencia de docs
// bloquee el arranque de la API.

const bearerAuthSecurity = [{ bearerAuth: [] }]

const idPathParam = (name, description) => ({
  in: 'path',
  name,
  required: true,
  description,
  schema: {
    type: 'integer'
  }
})

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Project Management System API',
    version: '1.0.0',
    description: 'API for management projects and tasks'
  },
  tags: [
    {
      name: 'Auth',
      description: 'Autenticacion y sesion'
    },
    {
      name: 'Projects',
      description: 'Gestion de proyectos'
    },
    {
      name: 'Tasks',
      description: 'Gestion de tareas'
    }
  ],
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Invalid credentials'
          }
        }
      },
      UserPublic: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'Luis Fer'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'luis@example.com'
          },
          role: {
            type: 'string',
            example: 'user'
          },
          created_at: {
            type: 'string',
            example: '2026-03-28 10:00:00'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string'
          },
          user: {
            $ref: '#/components/schemas/UserPublic'
          }
        }
      },
      Project: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'API Backend'
          },
          description: {
            type: 'string',
            example: 'Proyecto para practicar estructura backend'
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done'],
            example: 'pending'
          },
          created_at: {
            type: 'string',
            example: '2026-03-28 10:00:00'
          }
        }
      },
      ProjectCreateRequest: {
        type: 'object',
        required: ['name', 'status'],
        properties: {
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done']
          }
        }
      },
      ProjectUpdateRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done']
          }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          title: {
            type: 'string',
            example: 'Task 1'
          },
          description: {
            type: 'string',
            example: 'Setup backend structure'
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done'],
            example: 'pending'
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'high'
          },
          project_id: {
            type: 'integer',
            example: 1
          },
          user_id: {
            type: 'integer',
            nullable: true,
            example: 2
          },
          due_date: {
            type: 'string',
            nullable: true,
            example: '2026-04-03'
          },
          created_at: {
            type: 'string',
            example: '2026-03-28 10:00:00'
          },
          updated_at: {
            type: 'string',
            nullable: true,
            example: '2026-03-28 11:30:00'
          }
        }
      },
      TaskCreateRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done']
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high']
          },
          user_id: {
            type: 'integer'
          },
          due_date: {
            type: 'string',
            example: '2026-04-03'
          }
        }
      },
      TaskUpdateRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done']
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high']
          },
          user_id: {
            type: 'integer',
            nullable: true
          },
          due_date: {
            type: 'string',
            nullable: true,
            example: '2026-04-03'
          }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Registra un usuario',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuario creado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserPublic'
                }
              }
            }
          },
          400: {
            description: 'Datos invalidos.'
          },
          409: {
            description: 'El email ya esta registrado.'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Inicia sesion',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login exitoso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                }
              }
            }
          },
          401: {
            description: 'Credenciales invalidas.'
          }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Devuelve el usuario autenticado',
        tags: ['Auth'],
        security: bearerAuthSecurity,
        responses: {
          200: {
            description: 'Usuario autenticado obtenido correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserPublic'
                }
              }
            }
          },
          401: {
            description: 'Token faltante o invalido.'
          }
        }
      }
    },
    '/api/projects': {
      get: {
        summary: 'Lista proyectos',
        tags: ['Projects'],
        security: bearerAuthSecurity,
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done']
            },
            description: 'Filtra proyectos por estado.'
          },
          {
            in: 'query',
            name: 'sort',
            schema: {
              type: 'string',
              enum: ['asc', 'desc']
            },
            description: 'Ordena el resultado por id.'
          }
        ],
        responses: {
          200: {
            description: 'Lista de proyectos obtenida correctamente.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Project'
                  }
                }
              }
            }
          },
          400: {
            description: 'Filtros invalidos.'
          }
        }
      },
      post: {
        summary: 'Crea un proyecto',
        tags: ['Projects'],
        security: bearerAuthSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectCreateRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Proyecto creado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          },
          400: {
            description: 'Datos invalidos.'
          }
        }
      }
    },
    '/api/projects/{id}': {
      get: {
        summary: 'Obtiene un proyecto por id',
        tags: ['Projects'],
        security: bearerAuthSecurity,
        parameters: [idPathParam('id', 'Id del proyecto')],
        responses: {
          200: {
            description: 'Proyecto encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          },
          404: {
            description: 'Proyecto no encontrado.'
          }
        }
      },
      put: {
        summary: 'Actualiza un proyecto',
        tags: ['Projects'],
        security: bearerAuthSecurity,
        parameters: [idPathParam('id', 'Id del proyecto')],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectUpdateRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Proyecto actualizado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          },
          400: {
            description: 'Datos o id invalidos.'
          },
          404: {
            description: 'Proyecto no encontrado.'
          }
        }
      },
      delete: {
        summary: 'Elimina un proyecto',
        tags: ['Projects'],
        security: bearerAuthSecurity,
        parameters: [idPathParam('id', 'Id del proyecto')],
        responses: {
          200: {
            description: 'Proyecto eliminado correctamente.'
          },
          403: {
            description: 'Solo admin puede eliminar proyectos.'
          },
          404: {
            description: 'Proyecto no encontrado.'
          }
        }
      }
    },
    '/api/tasks': {
      get: {
        summary: 'Lista tareas globalmente',
        tags: ['Tasks'],
        security: bearerAuthSecurity,
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done']
            }
          },
          {
            in: 'query',
            name: 'priority',
            schema: {
              type: 'string',
              enum: ['low', 'medium', 'high']
            }
          },
          {
            in: 'query',
            name: 'sort',
            schema: {
              type: 'string',
              enum: ['asc', 'desc']
            }
          }
        ],
        responses: {
          200: {
            description: 'Lista de tareas obtenida correctamente.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            }
          },
          400: {
            description: 'Filtros invalidos.'
          }
        }
      }
    },
    '/api/projects/{projectId}/tasks': {
      get: {
        summary: 'Lista tareas de un proyecto',
        tags: ['Tasks'],
        security: bearerAuthSecurity,
        parameters: [idPathParam('projectId', 'Id del proyecto')],
        responses: {
          200: {
            description: 'Lista de tareas del proyecto.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            }
          },
          404: {
            description: 'Proyecto no encontrado.'
          }
        }
      },
      post: {
        summary: 'Crea una tarea dentro de un proyecto',
        tags: ['Tasks'],
        security: bearerAuthSecurity,
        parameters: [idPathParam('projectId', 'Id del proyecto')],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskCreateRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Tarea creada correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          400: {
            description: 'Datos invalidos.'
          },
          404: {
            description: 'Proyecto no encontrado.'
          }
        }
      }
    },
    '/api/projects/{projectId}/tasks/{id}': {
      get: {
        summary: 'Obtiene una tarea por id dentro de un proyecto',
        tags: ['Tasks'],
        security: bearerAuthSecurity,
        parameters: [
          idPathParam('projectId', 'Id del proyecto'),
          idPathParam('id', 'Id de la tarea')
        ],
        responses: {
          200: {
            description: 'Tarea encontrada.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          404: {
            description: 'Proyecto o tarea no encontrados.'
          }
        }
      },
      put: {
        summary: 'Actualiza una tarea',
        tags: ['Tasks'],
        security: bearerAuthSecurity,
        parameters: [
          idPathParam('projectId', 'Id del proyecto'),
          idPathParam('id', 'Id de la tarea')
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskUpdateRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Tarea actualizada correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          400: {
            description: 'Datos o id invalidos.'
          },
          404: {
            description: 'Proyecto o tarea no encontrados.'
          }
        }
      },
      delete: {
        summary: 'Elimina una tarea',
        tags: ['Tasks'],
        security: bearerAuthSecurity,
        parameters: [
          idPathParam('projectId', 'Id del proyecto'),
          idPathParam('id', 'Id de la tarea')
        ],
        responses: {
          200: {
            description: 'Tarea eliminada correctamente.'
          },
          404: {
            description: 'Proyecto o tarea no encontrados.'
          }
        }
      }
    }
  }
}

module.exports = swaggerSpec
