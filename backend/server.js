const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Project Planner API',
    endpoints: {
      projects: {
        list: 'GET /api/projects',
        single: 'GET /api/projects/:id',
        create: 'POST /api/projects',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id'
      },
      levels: {
        list: 'GET /api/projects/:projectId/levels',
        create: 'POST /api/projects/:projectId/levels',
        update: 'PUT /api/levels/:id',
        delete: 'DELETE /api/levels/:id'
      }
    }
  });
});

// Project routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { levels: true }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { levels: true }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    const project = await prisma.project.create({
      data: {
        name,
        description
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description
      }
    });
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Level routes
app.get('/api/projects/:projectId/levels', async (req, res) => {
  try {
    const { projectId } = req.params;
    const levels = await prisma.level.findMany({
      where: { projectId: parseInt(projectId) },
      orderBy: { order: 'asc' }
    });
    res.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

app.post('/api/projects/:projectId/levels', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Level name is required' });
    }

    const level = await prisma.level.create({
      data: {
        name,
        description,
        order: order || 0,
        projectId: parseInt(projectId)
      }
    });
    res.status(201).json(level);
  } catch (error) {
    console.error('Error creating level:', error);
    res.status(500).json({ error: 'Failed to create level' });
  }
});

app.put('/api/levels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, order } = req.body;
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED' 
      });
    }

    const level = await prisma.level.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(order !== undefined && { order })
      }
    });
    res.json(level);
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({ error: 'Failed to update level' });
  }
});

app.delete('/api/levels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.level.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting level:', error);
    res.status(500).json({ error: 'Failed to delete level' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
    server.close();
    app.listen(PORT + 1, () => {
      console.log(`Server is running on http://localhost:${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
}); 