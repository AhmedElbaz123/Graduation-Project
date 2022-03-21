const cloudinary  = require('cloudinary');

cloudinary.config({
    cloud_name:'egyptegypt',
    api_key: '993956571557143',
    api_secret: 'sqZSIMcg4006KHgI30_ol4erNuo'

})

exports.uploads = (file) =>{
    return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) =>{
    resolve({url: result.url, id: result.public_id})
    }, {resource_type: "auto"})
    })
}