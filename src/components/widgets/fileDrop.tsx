import { useContext, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import parseA7P, { ProfileProps } from "../../utils/parseA7P";
import { StyleSheet, StyleProp, ViewProps } from "react-native";
import { Button } from "react-native-paper";
import { CalculationContext } from "../../context/profileContext";

// Define the allowed file types for upload
const fileTypes = ["A7P"];

interface A7PFileUploaderProps {
  style?: StyleProp<ViewProps>;
}

function A7PFileUploader({ style = null }: A7PFileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { profileProperties, setProfileProperties, updateProfileProperties } = useContext(CalculationContext);

  const onSuccess = (data: ProfileProps) => {
    if (profileProperties) {
      updateProfileProperties(data)
    } else {
      setProfileProperties(data)
    }
  }

  // Handle file change
  const handleChange = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        console.log("GOT PROFILE")
        parseA7P(event.target.result as ArrayBuffer)
          .then((parsedData) => {
            setError(null);
            setFileName(file.name);
            if (onSuccess) {
              onSuccess(parsedData);
            }
          })
          .catch((error: any) => {
            console.error(error);
            setError(error);
            setFileName(null);
          });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Determine the icon and label based on state
  const displayData = (): { icon: string; label: string } => {
    if (!error) {
      return {
        icon: !fileName ? "file-outline" : "file-check-outline",
        label: !fileName ? "Upload or drop a file right here (.A7P)" : `Uploaded successfully: ${fileName}`
      };
    }
    return {
      icon: "file-outline",
      label: `${error}`
    };
  };

  const { icon, label } = displayData();

  // Return the file uploader component
  return (
    <FileUploader
      error={!!error}
      handleChange={handleChange}
      name={"file"}
      types={fileTypes}
      style={style}
      maxSize={1}
      onTypeError={(error: string) => setError(error)}
      onSizeError={(error: string) => setError(error)}
    >
      <Button
        icon={icon}
        mode={'outlined'}
        onPress={() => console.log('Pressed')}
        style={styles.btnStyle}
        contentStyle={styles.btnContentStyle}
      >
        {fileName ? fileName : label}
      </Button>
    </FileUploader>
  );
}

const styles = StyleSheet.create({
  btnStyle: {
    height: 32,
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2,
  },
  btnContentStyle: {
    height: 32,
  },
});

export default A7PFileUploader;
