import './config.js'

import express from "express";

import cors from 'cors'
import helmet from 'helmet';

import * as Controller from './Modules/controller.index.js'

import { dbConnection } from "./DB/db.connection.js";

import { limiter } from './Middlewares/index.js';

// Create Express Application
const app = express();

// Parse Body in request for all the comming routers
app.use(express.json());

// express.static
app.use('/uploads', express.static('uploads'))

var whitelist = process.env.WHITE_LISTED_ORIGINS
var corsOptions = {
  origin: function (origin, callback) {
    console.log('The current origin is' , origin);
    
    if (whitelist.includes(origin) !== -1  || origin == undefined) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


app.get('/', (req, res) => {
    res.send('Congratulations your code is running!');
})

app.use(cors(corsOptions))
app.use('/api/users', Controller.userRouter , Controller.authRouter);
app.use(helmet());
app.use(limiter)

// Use Routes
app.use('/api/messages', Controller.messageRouter);

// Database Connection
dbConnection()

// Check if the route is not found
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error Handling
app.use(async (err, req, res, next) => {
  console.log(err);
  
    if(req.session?.inTransaction()){
        // abort
        await req.session.abortTransaction()
        // end session
        req.session.endSession()
    }
    res.status(err.cause || 500).json({ message: "Something broke!" , error: err.message });
});

// Start Server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
