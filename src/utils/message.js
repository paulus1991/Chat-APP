const generate= (username,text)=>{
return {
    username,
    text,
    createdAt:new Date().getTime()

}
}

const generateShare = (username,url)=>{
    return {
        username,
        url,
        createdAt:new Date().getTime()
    }
}
module.exports={
    generate,
    generateShare
}