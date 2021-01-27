const users = []

 const addUser = ({id,username,room})=>{
username=username.trim().toLowerCase()
room = room.trim().toLowerCase()
if(!username||!room){
return {
    error:'Username and room are required'
}

}



const existingUser = users.find((user)=>{
return user.room===room&& user.username===username
})

if(existingUser){
    return{
        error:'Username is already logged'
    }
}

const user ={id,username,room}
users.push(user)
return {user}
 }

 const getUsersInRoom=(room)=>{
return users.filter((user)=>user.room===room)
}
 const getUser=(id)=>{
  return users.find((user)=>user.id===id
  )
    }
 const removeUser =(id)=>{
const index= users.findIndex((user)=>{
    return user.id===id
  
})
if(index!==-1){
    return users.splice(index,1)[0]
}
 }
 addUser({id:22,username:'pai',room:'sunny'})
 addUser({id:2232,username:'paiu',room:'sunny'})
 addUser({id:221,username:'pais',room:'sunngasy'})

 const usrty =getUser(22)
 console.log(usrty)

 const text = getUsersInRoom('sunnay')
 console.log(text)

 module.exports={
     addUser,
     removeUser,
     getUser,getUsersInRoom

 }