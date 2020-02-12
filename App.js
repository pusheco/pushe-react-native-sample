import React ,{ useState } from 'react';
import { StyleSheet,SafeAreaView, Text, View,FlatList ,ScrollView,TouchableOpacity,Alert} from 'react-native';
import Pushe from "pushe-react-native";
// import DialogInput from 'react-native-dialog-input';
import {useAppState, ACTIONS} from "./AppStates";
import DialogInput from "./DialogInput"

const DATA = [
  {
    id: 'ids',
    title: 'IDs',
  },
  {
    id: 'custom id',
    title: 'Custom Id',
  },
  {
    id: 'phone number',
    title: 'Phone Number',
  },
  {
    id: 'email',
    title: 'Email',
  },
  {
    id: 'module initialization',
    title: 'Modules initialization status',
  },
  {
    id: 'device registration',
    title: 'Device registration status',
  },
  {
    id: 'topic',
    title: 'Topic',
  },
  {
    id: 'tag',
    title: 'Tag (name:value)',
  },
  {
    id: '8',
    title: 'Analytics: Event',
  },
  {
    id: '9',
    title: 'Analytics: E-commerce',
  },
  {
    id: '10',
    title: 'Notification: Android Id',
  },
  {
    id: '11',
    title: 'Notification: Google Ad Id',
  },
  {
    id: '12',
    title: 'Notification: Custom Id',
  },
];

function Item({ id,title,onSelect }) {
  return (
    <TouchableOpacity  onPress={() => onSelect(id)}>
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
    </TouchableOpacity>
  );
}
function Dialog ({visibility,title,message,hint,button1,button2,onPressButton1,onPressButton2}) {
    return (
      <DialogInput isDialogVisible={visibility}
                title={title}
                message={message}
                hintInput ={hint}
                submitText ={button1}
                cancelText ={button2}
                submitInput={ (inputText) => {onPressButton1(inputText)} }
                closeDialog={ (inputText) => {onPressButton2(inputText)}}>
        </DialogInput>
    );
  // }
}


function showAlert(title,message)
{
  Alert.alert(
    title,
    message,
    [
      {text: 'Ok'},
    ],
    {cancelable: true},
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
  const [state, updateState] = useAppState();

  const onSelect = React.useCallback(
    async (id) => {
      switch(id) {
        case 'ids' : 
          const androidId = await Pushe.getAndroidId();
          const adId = await Pushe.getGoogleAdvertisingId();
          showAlert("IDs",`Android Id:\n ${androidId} \nGoogle Ad Id:\n ${adId}`);
          break;
        case 'custom id':
          const customId = await Pushe.getCustomId();
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload:{
                title:'IDs',
                message:`Current Custom Id: ${customId}`,
                button1Action:(inputData) => {  Pushe.setCustomId(inputData); 
                                                updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Custom Id is ${inputData}\n ${ new Date().toLocaleString()}`});
                                             },
                button2Action:() => { updateState({type: ACTIONS.HIDE_DIALOG});}
               }
            });
          break;

          case 'phone number':
          const phoneNumber = await Pushe.getUserPhoneNumber();
          updateState(
            {
              type: ACTIONS.SHOW_DIALOG,
              payload:{
                title:'Phone Number',
                message:`Current Phone Number: ${phoneNumber}`,
                button1Action:(inputData) => {  Pushe.setUserPhoneNumber(inputData); 
                                                updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Phone Number is ${inputData}\n ${ new Date().toLocaleString()}`});
                                             },
                button2Action:() => { updateState({type: ACTIONS.HIDE_DIALOG});}
               }
            });
          break;

          case 'email':
            const email = await Pushe.getUserEmail();
            updateState(
              {
                type: ACTIONS.SHOW_DIALOG,
                payload:{
                  title:'Email',
                  message:`Current Email: ${email}`,
                  button1Action:(inputData) => {  Pushe.setUserEmail(inputData); 
                                                  updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Email is ${inputData}\n ${ new Date().toLocaleString()}`});
                                               },
                  button2Action:() => { updateState({type: ACTIONS.HIDE_DIALOG});}
                 }
              });
            break;
            case 'module initialization':
              const isInitialized = await Pushe.isInitialized()
              updateState({type: ACTIONS.APPEND_LOG,log:state.log+"\n------------\n"+`Modules Initialized: ${isInitialized}\n ${ new Date().toLocaleString()}`});
              break;

            case 'device registration':
              const isRegistered = await Pushe.isRegistered()
              updateState({type: ACTIONS.APPEND_LOG,log:state.log+"\n------------\n"+`Device Registered: ${isRegistered}\n ${ new Date().toLocaleString()}`});
              break;

            case 'topic':
                const topics = await Pushe.getSubscribedTopics();
                updateState(
                  {
                    type: ACTIONS.SHOW_DIALOG,
                    payload:{
                      title:'Topic',
                      message:`Topics: [${topics}]`,
                      button1Title:'Subscribe',
                      button2Title: 'Unsubscribe',
                      button1Action:(inputData) => {  Pushe.subscribeToTopic(inputData); 
                                                      updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Subscribed to ${inputData}\n ${ new Date().toLocaleString()}`});
                                                   },
                      button2Action:(inputData) => { if(inputData!="")
                                                          {
                                                             Pushe.unsubscribeFromTopic(inputData);
                                                             updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Unsubscribe from ${inputData}\n ${ new Date().toLocaleString()}`});
                                                          }
                                                      else
                                                      updateState({type: ACTIONS.HIDE_DIALOG,log:state.log});
                                                   }
                     }
                  });
                break;
                
            case 'tag':
                  const topics = await Pushe.getSubscribedTopics();
                  updateState(
                    {
                      type: ACTIONS.SHOW_DIALOG,
                      payload:{
                        title:'Topic',
                        message:`Topics: [${topics}]`,
                        button1Title:'Subscribe',
                        button2Title: 'Unsubscribe',
                        button1Action:(inputData) => {  Pushe.subscribeToTopic(inputData); 
                                                        updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Subscribed to ${inputData}\n ${ new Date().toLocaleString()}`});
                                                     },
                        button2Action:(inputData) => { if(inputData!="")
                                                            {
                                                               Pushe.unsubscribeFromTopic(inputData);
                                                               updateState({type: ACTIONS.HIDE_DIALOG,log:state.log+"\n------------\n"+`Unsubscribe from ${inputData}\n ${ new Date().toLocaleString()}`});
                                                            }
                                                        else
                                                        updateState({type: ACTIONS.HIDE_DIALOG,log:state.log});
                                                     }
                       }
                    });
                  break;
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Text style = {{color:'#17202A',fontSize : 18,textAlign:'center',fontWeight:'bold'}}>Pushe Sample</Text>
      <Text style = {{color:'#FDFEFE',fontSize : 15 ,textAlign:'center'}}>React Native Module: 2.0.1 | native version: 2.0.4</Text>
      </View>
      <FlatList style = {styles.flatList}
        data={DATA}
        renderItem={({ item }) => <Item id={item.id} title={item.title} onSelect={onSelect}/>}
        keyExtractor={item => item.id}
        ItemSeparatorComponent = { FlatListItemSeparator }
      />
      <ScrollView style={styles.scrollView}>
        <Text >
         {state.log}
        </Text>
      </ScrollView>
      <Dialog  visibility={state.dialogVisiblity} 
               title={state.dialolgData.title} 
               message={state.dialolgData.message} 
               button1 = {state.dialolgData.button1Title}
               button2 = {state.dialolgData.button2Title}
               onPressButton1={state.dialolgData.button1Action}
               onPressButton2={state.dialolgData.button2Action}
               
               />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header :
  {
    alignContent :'center',
    backgroundColor:'#2E86C1',
    paddingTop:8,
    paddingBottom :8,
  },
  flatList:
  {
      // flex:2
  }
  
  ,item: {
    backgroundColor: '#FDFEFE',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
    color:'#3498DB',
    textAlign:'center'
  },
  scrollView :
  {
    height :200,
    padding :8
  },
});
