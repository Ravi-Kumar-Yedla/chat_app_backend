import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket.js'
// import path from 'path'
dotenv.config()

const PORT = process.env.PORT ||5000;

// const _dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/users' ,userRoutes)

// app.use(express.static(path.join(_dirname, "/Frontend/dist")));
// app.get('*',(_,res)=>{
//     res.sendFile(path.resolve(_dirname,"Frontend","dist","index.html"))
// })

server.listen(PORT, () => {
    console.log(`server listeneing on ${PORT}`)
    connectDB();
})
