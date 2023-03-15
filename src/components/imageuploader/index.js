import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

function ImageUploader() {
  const [files, setFiles] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    axios.post('/api/upload', formData)
      .then(() => {
        setFiles([]);
        alert('Upload successful!');
      })
      .catch((err) => {
        console.error(err);
        alert('Upload failed!');
      });
  };

  const handleSave = () => {
    const savedFiles = files.map((file) => ({
      name: file.name,
      type: file.type,
      dataURL: URL.createObjectURL(file),
    }));
    localStorage.setItem('files', JSON.stringify(savedFiles));
    setFiles([]);
    alert('Files saved locally!');
  };
  

  const handleLoad = () => {
    const savedFiles = JSON.parse(localStorage.getItem('files'));
    if (savedFiles) {
      const loadedFiles = savedFiles.map((savedFile) => {
        const blob = dataURLtoBlob(savedFile.dataURL, savedFile.type);
        return new File([blob], savedFile.name, { type: savedFile.type });
      });
      setFiles(loadedFiles);
      alert('Files loaded from local storage!');
    } else {
      alert('No files found in local storage!');
    }
  };
  
  
  function dataURLtoBlob(dataurl) {
    try {
      var arr = dataurl.split(','), 
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  return (
    <div>
      <Dropzone onDrop={handleDrop} class='Card'>
        
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleSave}>Save locally</button>
      <button onClick={handleLoad}>Load from local storage</button>
      {files.map((file) => (
        <div key={file.name}>
          <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '80%', maxHeight: '300px' }} />
          <button onClick={() => setFiles((prevFiles) => prevFiles.filter((f) => f !== file))}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default ImageUploader;

