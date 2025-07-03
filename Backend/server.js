const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const workflowScheduler = require('./Services/scheduler');

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const uploadRoutes = require('./routes/upload');
const builderRoutes = require('./routes/builder');
const triggerRouter = require('./routes/trigger');
const schedulerRoutes = require('./routes/scheduler');

const app = express();

// Allow requests from specific origin (frontend domain)
// const allowedOrigins = ['https://shree-vidya-saraswati-pujan.netlify.app'];
const allowedOrigins = process.env.ALLOWED_ORIGINS;
app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        // console.log("errorrrr...")
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    const schedulerStatus = workflowScheduler.getStatus();
    res.json({
        message: 'FlowEn Server is running',
        scheduler: schedulerStatus,
        timestamp: new Date().toISOString()
    });
});

// Scheduler status endpoint
app.get('/scheduler/status', (req, res) => {
    res.json(workflowScheduler.getStatus());
});

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/builder', builderRoutes);
app.use('/api/triggers', triggerRouter);
app.use('/api/scheduler', schedulerRoutes);

const PORT = process.env.PORT || 5000;


async function startServer() {
    try {
        console.log('🚀 Starting ReGenest Server...');
        
        // Initialize the workflow scheduler
        await workflowScheduler.initialize();
        
        // Start the Express server
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📅 Scheduler initialized with ${workflowScheduler.getStatus().activeJobs} active jobs`);
        });

        // Graceful shutdown handling
        process.on('SIGTERM', async () => {
            console.log('\n🛑 SIGTERM received, shutting down gracefully...');
            workflowScheduler.shutdown();
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('\n🛑 SIGINT received, shutting down gracefully...');
            workflowScheduler.shutdown();
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();


// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

//Following code for running the server on specific network i.e. IP
// app.listen(PORT, '10.112.9.12', () => {
//     console.log(`Server running on port ${PORT}`);
//   });
