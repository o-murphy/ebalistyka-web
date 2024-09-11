import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["A7P"];

function FileDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default FileDrop;

// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, Platform } from 'react-native';

// export default function FileDrop() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [dragActive, setDragActive] = useState(false);
//   const dropZoneRef = useRef<HTMLDivElement | null>(null);
//   const dragActiveRef = useRef<boolean>(false);

//   // Handle file drop
//   const handleDrop = (event: DragEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setDragActive(false);

//     const files = event.dataTransfer.files;
//     if (files && files[0]) {
//       setSelectedFile(files[0]);
//     }
//   };

//   // Handle drag events
//   const handleDragOver = (event: DragEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
//     if (!dragActiveRef.current) { // Prevent continuous state updates
//       setDragActive(true);
//       dragActiveRef.current = true;
//     }
//   };

//   const handleDragLeave = (event: DragEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
//     if (dragActiveRef.current) {
//       setDragActive(false);
//       dragActiveRef.current = false;
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   // Handle click to trigger file input
//   const handleClick = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   useEffect(() => {
//     const dropZone = dropZoneRef.current;

//     if (dropZone) {
//       dropZone.addEventListener('dragover', handleDragOver);
//       dropZone.addEventListener('dragleave', handleDragLeave);
//       dropZone.addEventListener('drop', handleDrop);
//     }

//     return () => {
//       if (dropZone) {
//         dropZone.removeEventListener('dragover', handleDragOver);
//         dropZone.removeEventListener('dragleave', handleDragLeave);
//         dropZone.removeEventListener('drop', handleDrop);
//       }
//     };
//   }, []); // Dependency array is empty to ensure this effect runs only once

//   return (
//     <View style={styles.container}>
//       <View
//         ref={dropZoneRef}
//         onClick={handleClick}
//         style={dragActive ? styles.activeDropZone : styles.dropZone}
//       >
//         <input
//           type="file"
//           id="fileInput"
//           style={{ display: 'none' }}
//           onChange={handleFileChange}
//         />
//         <Text style={styles.text}>
//           {selectedFile ? selectedFile.name : 'Drag & Drop your file here or click to upload'}
//         </Text>
//       </View>
//       {selectedFile && (
//         <View style={styles.fileInfo}>
//           <Text>Selected file: {selectedFile.name}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 20,
//   },
//   dropZone: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: '#999',
//     borderStyle: 'dashed',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     cursor: Platform.OS === 'web' ? 'pointer' : 'default',
//     textAlign: 'center',
//   },
//   activeDropZone: {
//     borderColor: '#0057ff',
//     backgroundColor: '#e0eaff',
//   },
//   text: {
//     fontSize: 16,
//   },
//   fileInfo: {
//     marginTop: 10,
//   },
// });
