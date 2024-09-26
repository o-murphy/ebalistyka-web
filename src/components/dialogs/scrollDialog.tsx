import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Dialog, FAB, Portal } from "react-native-paper";
import { useTheme } from "../../context/themeContext";

const SimpleScrollDialog = ({
  children,
  title,
  text,
  icon = null,
  onAccept = null,
  onDecline = null
}) => {

  const [visible, setVisible] = useState(false);

  const {theme} = useTheme()

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
      setVisible(false);
  };

  const onAcceptBtn = () => {
      if (onAccept) onAccept();
      setVisible(false);
  }

  const onDeclineBtn = () => {
      if (onDecline) onDecline();
      setVisible(false);
  }

  return (
      <View style={{ flex: 1 }} >
          <Chip icon={icon} closeIcon="square-edit-outline" textStyle={{ fontSize: 16 }}
              onPress={showDialog}
              onClose={showDialog}
          // textStyle={{fontSize: 18}}
          >
              {text}
          </Chip>
          <Portal>

              <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
                  <Dialog.Title>{title}</Dialog.Title>

                  <Dialog.ScrollArea>
                      <ScrollView contentContainerStyle={{ padding: 24 }}>
                          {children}
                      </ScrollView>
                  </Dialog.ScrollArea>

                  <Dialog.Actions>
                      <FAB icon="close" mode={"flat"} size={'small'} onPress={onDeclineBtn}
                          variant={'tertiary'} color={theme.colors.tertiary} />
                      <FAB icon="check" mode={"flat"} size={'small'} onPress={onAcceptBtn} />
                  </Dialog.Actions>
              </Dialog>

          </Portal>
      </View>
  );
};

const styles = StyleSheet.create({
  dialog: { width: 360, alignSelf: 'center', justifyContent: 'center' },
});


export default SimpleScrollDialog;