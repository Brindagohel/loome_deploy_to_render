import React, { useRef , useEffect } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
//import { UploadCloudIcon } from 'lucide-react';
import { Button } from "../ui/button";                          // ✅ added
import { UploadCloudIcon, FileIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';


function ProductImageUpload({ file, setFile, uploadedImageUrl, setUploadedImageUrl ,setImageLoadingState , imageLoadingState , isEditMode ,isCustomStyling = false}){

    const inputRef = useRef(null);

    function handleImageFile(event){
        //const file = event.target.files[0];
        const selectedFile = event.target.files?.[0];
        if(selectedFile) setFile(selectedFile);

      

    }

    function handleDragOver(event){
        event.preventDefault();
    }

    function handleDrop(event){
        event.preventDefault();
        const droppedFile= event.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);   
    }

    function handleRemoveImage(){
        setFile(null);      
        if(inputRef.current)
            {
            inputRef.current.value = "";
           }
    }

    console.log(file);

   async function uploadImageToCloudinary(){
    setImageLoadingState(true);
    try {
        const data = new FormData();
        data.append('my_file', file);
        const response = await axios.post('http://localhost:5000/api/admin/products/upload-image', data);
        if(response?.data?.success) {
            setUploadedImageUrl(response.data.result.url);
        }
    } catch(error) {
        console.log(error);
    } finally {
        setImageLoadingState(false); // always runs, success or failure
    }
}

    useEffect(()=> {
        if(file != null) uploadImageToCloudinary()
    }, [file])


    
    return(
        <div className={`w-full  mt-4 ${isCustomStyling ? '' :'max-w-md mx-auto' }`}>
            <Label className="text-lg font-semibold mb-2 block ">Upload Image</Label>
            <div onDragOver= {handleDragOver} onDrop={handleDrop} className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}>
                <Input id="image-upload" type="file" className="hidden" 
                ref={inputRef} onChange={handleImageFile}
                disabled = {isEditMode}
                />
                {
                    !file?
                    <Label htmlFor="image-upload" className={` ${isEditMode ? 'cursor-not-allowed' : ''} 
                    flex flex-col items-center justify-center h-32 cursor-pointer `}>
                        <UploadCloudIcon className="w-10 text-muted-foreground mb-2"/>
                        <span>Drag and Drop or Click to Upload Image</span>
                    </Label>
                    :(
                        imageLoadingState?
                        <Skeleton className='h-10 bg-gray-100'/>:

                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                             <FileIcon className="w-8 text-primary mr-2 h-8" /> 
                        </div>
                        <p className="text-sm font-muted">{file.name}</p>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground " onClick={handleRemoveImage}>
                            <XIcon className="w-4 h-4"/>
                            <span className="sr-only">Remove File</span>
                        </Button>
                     </div>

                )}
            </div>
        </div>
    );
}

export default ProductImageUpload;