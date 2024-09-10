import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FileDrop() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const dropZoneRef = useRef(null);

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  // Handle drag events
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  // Attach event listeners to the HTML element
  useEffect(() => {
    const dropZone = dropZoneRef.current;

    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <View style={styles.container}>
      {/* Using a native div to support drag events */}
      <div
        ref={dropZoneRef}
        className={`drop-zone ${dragActive ? 'active' : ''}`}
        onClick={() => document.getElementById('fileInput').click()}
        style={dragActive ? styles.activeDropZone : styles.dropZone}
      >
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Text style={styles.text}>
          {selectedFile ? selectedFile.name : 'Drag & Drop your file here or click to upload'}
        </Text>
      </div>
      {selectedFile && (
        <View style={styles.fileInfo}>
          <Text>Selected file: {selectedFile.name}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  dropZone: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: '#999',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    display: 'flex', // This is for centering children in div
    textAlign: 'center',
  },
  activeDropZone: {
    borderColor: '#0057ff',
    backgroundColor: '#e0eaff',
    ...this.dropZone,
  },
  text: {
    fontSize: 16,
  },
  fileInfo: {
    marginTop: 10,
  },
});


// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function FileDrop() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [dragActive, setDragActive] = useState(false);

//   const handleDrop = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setDragActive(false);

//     const files = event.dataTransfer.files;
//     if (files && files[0]) {
//       setSelectedFile(files[0]);
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setDragActive(true);
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setDragActive(false);
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View
//         style={[styles.dropZone, dragActive && styles.activeDropZone]}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onClick={() => document.getElementById('fileInput').click()}
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
//     cursor: 'pointer',
//   },
//   activeDropZone: {
//     borderColor: '#0057ff',
//     backgroundColor: '#e0eaff',
//   },
//   text: {
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   fileInfo: {
//     marginTop: 10,
//   },
// });
