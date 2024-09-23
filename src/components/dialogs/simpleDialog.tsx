import React, { useState, useEffect, useRef } from 'react';
import { Portal, Chip, useTheme, Dialog, FAB } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const SimpleDialog = ({
  children,
  label,
  text,
  icon = null,
  onAccept = null,
  onDecline = null,
  style = null,
}) => {
  const [visible, setVisible] = useState(false);
  const childRef = useRef(null); // Reference for the child

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
  };

  const onAcceptBtn = () => {
    if (onAccept) onAccept();
    setVisible(false);
  };

  const onDeclineBtn = () => {
    if (onDecline) onDecline();
    setVisible(false);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if Enter key is pressed
      if (event.key === 'Enter') {
        onAcceptBtn();
      }
    };

    if (visible) {
      // Add the keydown listener when dialog is visible
      window.addEventListener('keydown', handleKeyPress);

      // Focus on the child element if it has a ref
      if (childRef.current) {
        childRef.current.focus();
      }
    }

    // Cleanup listener on unmount or when dialog closes
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [visible]);

  return (
    <View style={style}>
      <Chip
        icon={icon}
        closeIcon="square-edit-outline"
        style={{ margin: 0 }}
        textStyle={{ fontSize: 16 }}
        onPress={showDialog}
        onClose={showDialog}
      >
        {text}
      </Chip>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>{label}</Dialog.Title>

          <Dialog.Content>{children}</Dialog.Content>

          <Dialog.Actions>
            <FAB
              icon="close"
              mode="flat"
              size="small"
              onPress={onDeclineBtn}
              variant="tertiary"
              color={useTheme().colors.tertiary}
            />
            <FAB icon="check" mode="flat" size="small" onPress={onAcceptBtn} />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  dialog: { width: 400, alignSelf: 'center', justifyContent: 'center' },
});

export default SimpleDialog;
