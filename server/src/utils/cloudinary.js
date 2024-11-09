import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret:process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log(`Attempting to upload file from path: ${localFilePath}`);

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        console.log("file is uploaded on cloudinary", response.url);

        if (fs.existsSync(localFilePath)) {
            console.log(`Deleting file from path: ${localFilePath}`);
            fs.unlinkSync(localFilePath);
        } else {
            console.log(`File does not exist at path: ${localFilePath}`);
        }

        return response;
    } catch (error) {
        console.error(`Error uploading file: ${error.message}`);
        if (fs.existsSync(localFilePath)) {
            console.log(`Deleting file from path after error: ${localFilePath}`);
            fs.unlinkSync(localFilePath);
        } else {
            console.log(`File does not exist at path after error: ${localFilePath}`);
        }
        return null;
    }
};


export {uploadOnCloudinary}
