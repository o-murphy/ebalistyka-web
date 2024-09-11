import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import parseA7P from "../../utils/parseA7P";
import { ProfileProps } from '../../utils/parseA7P';

const fileTypes = ["A7P"];

function A7PFileUploader({onSuccess = null}: {onSuccess?: (profile: ProfileProps) => void}) {
  const [error, setError] = useState(null);

  const handleChange = (file) => {

    // Create a FileReader instance
    const reader = new FileReader();

    // Define the onload event for the FileReader
    reader.onload = (event) => {
      // event.target.result contains the file data
      parseA7P(event.target.result).then(parsedData => {
        setError(null)  
        if (onSuccess) {
          onSuccess(parsedData)
        }
      }).catch(error => {
        setError(error)
      });
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  };

  return (
    <FileUploader error={error} handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default A7PFileUploader;
