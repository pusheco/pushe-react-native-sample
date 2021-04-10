import React, { useState, Fragment, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Pushe from "pushe-react-native";
import { useAppState, ACTIONS } from "./AppStates";
import DialogInput from "./DialogInput"

const DATA = [
  { id: 'ids', title: 'IDs' },
  { id: 'custom id', title: 'Custom Id' },
  { id: 'phone number', title: 'Phone Number' },
  { id: 'email', title: 'Email' },
  { id: 'module initialization', title: 'Modules initialization status' },
  { id: 'device registration', title: 'Device registration status' },
  { id: 'topic', title: 'Topic' },
  { id: 'tag', title: 'Tag (name:value)' },
  { id: 'event', title: 'Analytics: Event' },
  { id: 'ecommerce', title: 'Analytics: E-commerce' },
  { id: 'notif-androidid', title: 'Notification: Android Id' },
  { id: 'notif-googleid', title: 'Notification: Google Ad Id' },
  { id: 'notif-customid', title: 'Notification: Custom Id' },
  { id: 'toggle_foreground', title: 'Notification: Toggle foreground' },
  { id: 'piam_trigger_event', title: 'InAppMessaging: Trigger event' },
  { id: 'piam_enabled', title: 'InAppMessaging: Is InApp enabled' },
  { id: 'piam_disable', title: 'InAppMessaging: Disable InApp' },
  { id: 'piam_enable', title: 'InAppMessaging: Enable InApp' },
  { id: 'piam_dismiss_shown', title: 'InAppMessaging: Dismiss shown InApp' },
  { id: 'piam_test', title: 'InAppMessaging: Test InAppMessage' },
  { id: 'fcm_token', title: 'Get FCM token' },
  { id: 'hms_token', title: 'Get HMS token' },
  { id: 'active_service', title: 'Get active service' },
];

function Item({ id, title, onSelect }) {
  return (
    <TouchableOpacity onPress={() => onSelect(id)}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Dialog({ visibility, title, message, hint, button1, button2, onPressButton1, onPressButton2 }) {
  return (
    <DialogInput isDialogVisible={visibility}
      title={title}
      message={message}
      hintInput={hint}
      submitText={button1}
      cancelText={button2}
      submitInput={(inputText) => { onPressButton1(inputText) }}
      closeDialog={(inputText) => { onPressButton2(inputText) }}>
    </DialogInput>
  );
}

function showAlert(title, message) {
  Alert.alert(
    title,
    message,
    [
      { text: 'Ok' },
    ],
    { cancelable: true },
  );
}

FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 8,
        width: "100%",
        backgroundColor: "#F4F6F7",
      }}
    />
  );
}

export default function App() {

  useEffect(() => {
    Pushe.addEventListener(Pushe.EVENTS.BUTTON_CLICKED, notification => {
      console.log(notification);
    });
    Pushe.addEventListener(Pushe.EVENTS.RECEIVED, notification => {
      console.log(`Notif received`);
      console.log(notification);
    });
    Pushe.addEventListener(Pushe.EVENTS.INAPP_RECEIVED, (inApp) => {
      console.log(`InApp received ${inApp.title}`);
    });
    Pushe.addEventListener(Pushe.EVENTS.INAPP_TRIGGERED, (inApp) => {
      console.log(`InApp triggered ${inApp.title}`);
    })
    Pushe.addEventListener(Pushe.EVENTS.INAPP_CLICKED, (inApp) => {
      console.log(`InApp clicked ${inApp.title}`);
    });
    Pushe.addEventListener(Pushe.EVENTS.INAPP_DISMISSED, (inApp) => {
      console.log(`InApp dismissed ${inApp.title}`);
    });
    Pushe.addEventListener(Pushe.EVENTS.INAPP_BUTTON_CLICKED, (inApp) => {
      console.log(`InApp button ${inApp.title} index: ${inApp.index}`);
    });
  }, []);


  const [state, updateState] = useAppState();

  const onSelect = React.useCallback(
    async (id) => {
      switch (id) {
        case 'ids':
          const deviceId = await Pushe.getDeviceId();
          const adId = await Pushe.getAdvertisingId();
          showAlert("IDs", `Device Id:\n ${deviceId} \Ad Id:\n ${adId}`);
          break;
        case 'custom id':
          const customId = await Pushe.getCustomId();
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'IDs',
                message: `Current Custom Id: ${customId}`,
                button1Action: (inputData) => {
                  Pushe.setCustomId(inputData);
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Custom Id is ${inputData}\n ${new Date().toLocaleString()}` });
                },
                button2Action: () => { updateState({ type: ACTIONS.HIDE_DIALOG }); }
              }
            });
          break;
        case 'phone number':
          const phoneNumber = await Pushe.getUserPhoneNumber();
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'Phone Number',
                message: `Current Phone Number: ${phoneNumber}`,
                button1Action: (inputData) => {
                  Pushe.setUserPhoneNumber(inputData);
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Phone Number is ${inputData}\n ${new Date().toLocaleString()}` });
                },
                button2Action: () => { updateState({ type: ACTIONS.HIDE_DIALOG }); }
              }
            });
          break;
        case 'email':
          const email = await Pushe.getUserEmail();
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'Email',
                message: `Current Email: ${email}`,
                button1Action: (inputData) => {
                  Pushe.setUserEmail(inputData);
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Email is ${inputData}\n ${new Date().toLocaleString()}` });
                },
                button2Action: () => { updateState({ type: ACTIONS.HIDE_DIALOG }); }
              }
            });
          break;
        case 'module initialization':
          const isInitialized = await Pushe.isInitialized()
          updateState({ type: ACTIONS.APPEND_LOG, log: state.log + "\n------------\n" + `Modules Initialized: ${isInitialized}\n ${new Date().toLocaleString()}` });
          break;
        case 'device registration':
          const isRegistered = await Pushe.isRegistered()
          updateState({ type: ACTIONS.APPEND_LOG, log: state.log + "\n------------\n" + `Device Registered: ${isRegistered}\n ${new Date().toLocaleString()}` });
          break;
        case 'topic':
          const topics = await Pushe.getSubscribedTopics();
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'Topic',
                message: `Topics: [${topics}]`,
                button1Title: 'Subscribe',
                button2Title: 'Unsubscribe',
                button1Action: (inputData) => {
                  Pushe.subscribeToTopic(inputData);
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Subscribed to ${inputData}\n ${new Date().toLocaleString()}` });
                },
                button2Action: (inputData) => {
                  if (inputData != "") {
                    Pushe.unsubscribeFromTopic(inputData);
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Unsubscribe from ${inputData}\n ${new Date().toLocaleString()}` });
                  }
                  else
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log });
                }
              }
            });
          break;
        case 'tag':
          const tags = await Pushe.getSubscribedTags();
          const message = Object.entries(tags).map((tag, idx) => {
            return (
              `${tag[0]}:${tag[1]}`
            )
          });

          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'Tags',
                message: `Tags:\n {${message}}\n Enter name:value format for adding tag\nEnter key1,key2 format for removing tag(s)`,
                button1Title: 'Add',
                button2Title: 'Remove',
                button1Action: (inputData) => {
                  if (typeof inputData !== 'string') return;
                  const data = inputData.split(':');
                  obj = {};
                  obj[data[0]] = data[1];
                  Pushe.addTags(obj);
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Tag ${data[0]} added\n ${new Date().toLocaleString()}` });
                },
                button2Action: (inputData) => {
                  if (inputData !== "") {
                    if (typeof inputData !== 'string') return;
                    const data = inputData.split(',');
                    const keyList = [];
                    data.forEach(function (item, idx) {
                      keyList[idx] = item;
                    });

                    Pushe.removeTags(keyList);
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Tag(s) ${keyList} removed \n ${new Date().toLocaleString()}` });
                  }
                  else
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log });
                }
              }
            });
          break;
        case 'event':
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'Event',
                message: `Type event name to send`,
                button1Action: (inputData) => {
                  Pushe.sendEvent(inputData);
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending event ${inputData}\n ${new Date().toLocaleString()}` });
                },
                button2Action: () => { updateState({ type: ACTIONS.HIDE_DIALOG }); }
              }
            });
          break;
        case 'ecommerce':
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'E-Commerce',
                message: `Enter value in name:price format to send data`,
                button1Action: (inputData) => {
                  if (typeof inputData !== 'string') return;
                  const data = inputData.split(':');
                  if (data.length !== 2) return;
                  Pushe.sendEcommerceData(data[0], parseFloat(data[1]));
                  updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending E-Commerce data with name ${data[0]} and price ${data[1]}\n ${new Date().toLocaleString()}` });
                },
                button2Action: () => { updateState({ type: ACTIONS.HIDE_DIALOG }); }
              }
            });
          break;
        case 'notif-androidid':
          {
            const androidId = await Pushe.getAndroidId();
            console.log(androidId);
            updateState(
              {
                type: ACTIONS.SHOW_DIALOG,
                payload: {
                  title: 'Notification',
                  message: `Enter android id to send notification to the user`,
                  button1Title: 'Send to ...',
                  button2Title: 'Send to me',
                  button1Action: (inputData) => {
                    Pushe.sendNotificationToUser({ type: Pushe.ANDROID_ID_TYPES.ANDROID_ID, userId: inputData, title: 'hi', content: 'how are you?' });
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending notification to android id:${inputData} \n ${new Date().toLocaleString()}` });
                  },
                  button2Action: () => {
                    Pushe.sendNotificationToUser({ type: Pushe.ANDROID_ID_TYPES.ANDROID_ID, userId: androidId, title: 'hi', content: 'how are you?' });
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending notification to this device\n ${new Date().toLocaleString()}` });

                  }
                }
              });
          }
          break;
        case 'notif-googleid':
          {
            const googleId = await Pushe.getGoogleAdvertisingId();
            updateState(
              {
                type: ACTIONS.SHOW_DIALOG,
                payload: {
                  title: 'Notification',
                  message: `Enter google ad id to send notification to the user`,
                  button1Title: 'Send to ...',
                  button2Title: 'Send to me',
                  button1Action: (inputData) => {
                    Pushe.sendNotificationToUser({ type: Pushe.ANDROID_ID_TYPES.ADVERTISEMENT_ID, userId: inputData, title: 'hi', content: 'how are you?' });
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending notification to google ad id:${inputData} \n ${new Date().toLocaleString()}` });
                  },
                  button2Action: () => {
                    Pushe.sendNotificationToUser({ type: Pushe.ANDROID_ID_TYPES.ADVERTISEMENT_ID, userId: googleId, title: 'hi', content: 'how are you?' });
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending notification to this device\n ${new Date().toLocaleString()}` });

                  }
                }
              });
          }
          break;
        case 'notif-customid':
          {
            const customId = await Pushe.getCustomId();
            updateState(
              {
                type: ACTIONS.SHOW_DIALOG,
                payload: {
                  title: 'Notification',
                  message: `Enter custom id to send notification to the user`,
                  button1Title: 'Send to ...',
                  button2Title: 'Send to me',
                  button1Action: (inputData) => {
                    Pushe.sendNotificationToUser({ type: Pushe.ANDROID_ID_TYPES.CUSTOM_ID, userId: inputData, title: 'hi', content: 'how are you?' });
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending notification to custom id:${inputData} \n ${new Date().toLocaleString()}` });
                  },
                  button2Action: () => {
                    Pushe.sendNotificationToUser({ type: Pushe.ANDROID_ID_TYPES.CUSTOM_ID, userId: customId, title: 'hi', content: 'how are you?' });
                    updateState({ type: ACTIONS.HIDE_DIALOG, log: state.log + "\n------------\n" + `Sending notification to this device\n ${new Date().toLocaleString()}` });

                  }
                }
              });
          }
          break;
        case 'toggle_foreground':
          if(await Pushe.isForceForegroundAware())
            await Pushe.disableNotificationForceForegroundAware();
          else
            await Pushe.enableNotificationForceForegroundAware();
            updateState({
              type: ACTIONS.APPEND_LOG,
              log: state.log + `\n------------\nForeground awareness changed to ${await Pushe.isForceForegroundAware()}\n ${new Date().toLocaleString()}`
            });
          break;
        case 'piam_trigger_event':
          {
            updateState({
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'InAppMessaging',
                message: 'Trigger local event.\nEnter event name',
                button1Title: 'Trigger',
                button1Action: async (inputData) => {
                  await Pushe.triggerInAppEvent(inputData)
                  updateState({
                    type: ACTIONS.HIDE_DIALOG,
                    log: state.log + `\n------------\nTriggering local event ${inputData} \n ${new Date().toLocaleString()}`
                  });
                },
                button2Title: 'Cancel',
                button2Action: () => {
                  updateState({
                    type: ACTIONS.HIDE_DIALOG,
                    log: state.log
                  });
                }
              }
            });
          }
          break;
        case 'piam_enabled':
          {
            const isInAppEnabled = await Pushe.isInAppMessagingEnabled();
            updateState({
              type: ACTIONS.APPEND_LOG,
              log: state.log + `\n------------\nInAppMessaging ${isInAppEnabled ? "IS" : "IS NOT"} enabled.\n ${new Date().toLocaleString()}`
            });
          }
          break;
        case 'piam_disable':
          {
            await Pushe.disableInAppMessaging();
            updateState({
              type: ACTIONS.APPEND_LOG,
              log: state.log + `\n------------\nInAppMessaging is now disabled.\n ${new Date().toLocaleString()}`
            });
          }
          break;
        case 'piam_enable':
          {
            await Pushe.enableInAppMessaging();
            updateState({
              type: ACTIONS.APPEND_LOG,
              log: state.log + `\n------------\nInAppMessaging is now enabled.\n ${new Date().toLocaleString()}`
            });
          }
          break;
        case 'piam_dismiss_shown':
          {
            await Pushe.dismissShownInApp();
            updateState({
              type: ACTIONS.APPEND_LOG,
              log: state.log + `\n------------\nAny displaying InApp will dismiss.\n ${new Date().toLocaleString()}`
            });
          }
          break;
        case 'piam_test':
          {
            updateState({
              type: ACTIONS.SHOW_DIALOG,
              payload: {
                title: 'InAppMessaging',
                message: 'Test InAppMessage.\nPlease paste the string of message json (API body)',
                button1Title: 'Apply',
                button1Action: async (inputData) => {
                  await Pushe.testInAppMessage(inputData, false);
                  updateState({
                    type: ACTIONS.HIDE_DIALOG,
                    log: state.log + `\n------------\nTest message applied. Trigger the event to show the message.\n ${new Date().toLocaleString()}`
                  });
                },
                button2Title: 'Cancel',
                button2Action: () => {
                  updateState({
                    type: ACTIONS.HIDE_DIALOG,
                    log: state.log
                  });
                }
              }
            });
          }
          break;
        case 'fcm_token':
          updateState({
            type: ACTIONS.APPEND_LOG,
            log: state.log + `\n------------\nFcm token: ${await Pushe.getFcmToken()}\n ${new Date().toLocaleString()}`
          });
          break;
        case 'hms_token':
          updateState({
            type: ACTIONS.APPEND_LOG,
            log: state.log + `\n------------\Hms token: ${await Pushe.getHmsToken()}\n ${new Date().toLocaleString()}`
          });
          break;
        case 'active_service':
          updateState({
            type: ACTIONS.APPEND_LOG,
            log: state.log + `\n------------\nActive service: ${await Pushe.getActiveService()}\n ${new Date().toLocaleString()}`
          });
          break;
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: '#FDFEFE', fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>Pushe Sample</Text>
        <Text style={{ color: '#FDFEFE', fontSize: 15, textAlign: 'center' }}>React Native: 2.5.0</Text>
      </View>
      <FlatList style={styles.flatList}
        data={DATA}
        renderItem={({ item }) => <Item id={item.id} title={item.title} onSelect={onSelect} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
      <ScrollView style={styles.scrollView}>
        <Text >
          {state.log}
        </Text>
      </ScrollView>
      <Dialog visibility={state.dialogVisiblity}
        title={state.dialolgData.title}
        message={state.dialolgData.message}
        button1={state.dialolgData.button1Title}
        button2={state.dialolgData.button2Title}
        onPressButton1={state.dialolgData.button1Action}
        onPressButton2={state.dialolgData.button2Action}

      />
    </SafeAreaView>
  );
}

// Pushe primary color : 0065ff
// Pushe accent color : 00feb6

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header:
  {
    alignContent: 'center',
    backgroundColor: '#00feb6',
    paddingTop: 8,
    paddingBottom: 8,
  },
  flatList:
  {
    // flex:2
  }

  , item: {
    backgroundColor: '#FDFEFE',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
    color: '#0065ff',
    textAlign: 'center'
  },
  scrollView:
  {
    height: 200,
    padding: 8
  },
});
