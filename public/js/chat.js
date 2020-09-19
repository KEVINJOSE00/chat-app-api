
const socket = io()

//Elements
const $messageForm =document.querySelector('#message-form') 
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


//Templates 
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const $sendLocationButton = document.querySelector('#send-location')


socket.on('message', (message) =>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)

})


socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        url : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = $messageFormInput.value
  
    socket.emit("sendMessage", message, (error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        
        if(error){
            return console.log(error)
        }
        console.log('The message delivered!', message)
    })
})

$sendLocationButton.addEventListener('click', () =>{
   if(!navigator.geolocation){
       return alert('Geolocation is not supported by ypur browser!')
   }
   $sendLocationButton.setAttribute('disabled', 'disabled')


   navigator.geolocation.getCurrentPosition((position) =>{
       socket.emit("sendLocation", {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
         }, () => {
            $sendLocationButton.removeAttribute('disabled')
             console.log('Location shared')

         })
   })
})

