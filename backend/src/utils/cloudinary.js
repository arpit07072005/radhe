import {v2 as cloudinary} from "cloudinary"

import fs from "fs"


cloudinary.config({ 
    cloud_name:process.env.CLOUDENARY_CLOUD_NAME, 
    api_key: process.env.CLOUDENARY_API_KEY, 
    api_secret: process.env.CLOUDENARY_SECRET_KEY,
  });

  const uploadOnCloudinary = async (localFilePath)=>{
    try{
      if(!localFilePath){
        console.log("cloudenary not get localfilepath")
        return null
      }
const response = await cloudinary.uploader.upload(localFilePath,{
  resource_type: "auto"
})
fs.unlinkSync(localFilePath)
console.log("uploded on cloudinary")
return response;

    }catch(error){
      fs.unlinkSync(localFilePath)
      console.log("not uploded on cloudinary") 
        return null;
    }

  }


  export {uploadOnCloudinary}