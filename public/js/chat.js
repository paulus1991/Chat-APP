 
 
const socket=io()
const $messageForm=document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLication=document. querySelector('#send-location')
const $messages = document.querySelector('#messages')


const meesageTemplate = document.querySelector('#message-template').innerHTML
const sharingLocation = document.querySelector('#sharing').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll =()=>{

const $newsms= $messages.lastElementChild

const newMessageStyle= getComputedStyle($newsms)
const newMargine = parseInt(newMessageStyle.marginBottom)
const newMessageHeight= $newsms.offsetHeight +newMargine


const visible = $messages.offsetHeight

const containerHeight = $messages.scrollHeight

const scrollOfSet= $messages.scrollTop +visible

if(containerHeight - newMessageHeight <= scrollOfSet){
$messages.scrollTop=$messages.scrollHeight
}
}
socket.on('sharelocation',(share)=>{
    console.log(share.url)
    const html =Mustache.render(sharingLocation,{
        username:share.username,
        share:share.url,
        createdAt:moment(share.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

 socket.on('message',(message)=>{
     console.log(message)
const html = Mustache.render(meesageTemplate,{
    username:message.username,
    message:message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
})
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
 })

 socket.on('data',({room,users})=>{
 const html = Mustache.render(sidebarTemplate,{
     room,
     users
 })
 document.querySelector('#sidebar').innerHTML=html
 })

 $messageForm.addEventListener('submit',(e)=>{
 e.preventDefault()

 $messageFormButton.setAttribute('disabled','disabled')

const message = e.target.elements.message.value

 socket.emit('sendMessage',message,(error)=>{
$messageFormButton.removeAttribute('disabled')
$messageFormInput.value=''
$messageFormInput.focus()

    if(error){
        return console.log(error)
    }
    console.log('message delivered')
 })
})

$shareLication.addEventListener('click',()=>{
    if(!navigator.geolocation){
return alert('Geolocation is not supported')
    }
    $shareLication.setAttribute('disabled','disabled')


    navigator.geolocation.getCurrentPosition((position)=>{
socket.emit('sharelocation',{
    latitude:position.coords.latitude,
    longitude:position.coords.longitude
    
},()=>{
    $shareLication.removeAttribute('disabled')
    console.log('Location shared')
})    })
    
})

socket.emit('join',{
    username,room
},(error)=>{
    
})
// socket.on('countUpdated',(count)=>{
// console.log('The count has been updated ' +  count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })
