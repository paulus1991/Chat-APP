const path = require('path')
 const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
 const express = require('express')
const http = require('http')
const socketIo= require('socket.io')
const Filter = require('bad-words')
const {generate,generateShare}=require('./utils/message')
 


const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const port = process.env.PORT||3000
const publicPath=path.join(__dirname,'../public')
app.use(express.static(publicPath))
 
io.on('connection',(socket)=>{
console.log('new web sockets coonection')
 

socket.on('join',({username,room},callback)=>{
const{error,user}=addUser({id:socket.id,username,room})

if(error){
return callback(error) 
}


socket.join(user.room)
socket.emit('message', generate('Welcome Friends'))
socket.broadcast.to(user.room).emit('message',generate(`${user.username} has joined the room`))
io.to(user.room).emit('data',{
    room:user.room,
    users:getUsersInRoom(user.room)
})
callback()
})


socket.on('sendMessage',(message,callback)=>{
    const user = getUser(socket.id)
    const filter = new Filter()
    if(filter.isProfane(message)){
return callback('Profanity is not allowed')
    }

io.to(user.room).emit('message',generate(user.username,message))
callback()

})
socket.on('sharelocation',((share,callback)=>{
    const user = getUser(socket.id)
    io.to(user.room).emit('sharelocation',generateShare(user.username,`https://google.com/maps?q=${share.latitude},${share.longitude}`) )
    callback()
}))


socket.on('disconnect',()=>{
  const user=  removeUser(socket.id)
  if(user){
    io.to(user.room).emit('message',generate(`the ${user.username} was disconnected`))
io.to(user.room).emit('data',{
    room:user.room,
    users:getUsersInRoom(user.room)
})
  }
     
    
})
 
// socket.emit('countUpdated',count)
// socket.on('increment',()=>{
//     count++
//  io.emit('countUpdated',count)})

})
server.listen(port,()=>{
    console.log('server is working on the port ' + port)
})