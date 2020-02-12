import React ,{ useState } from 'react';
import { StyleSheet,SafeAreaView, Text, View,FlatList ,ScrollView,TouchableOpacity,Alert} from 'react-native';
import Pushe from "pushe-react-native";
import DialogInput from 'react-native-dialog-input';
import {useAppState, ACTIONS} from "./AppStates";

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
    id: '2',
    title: 'Phone Number',
  },
  {
    id: '3',
    title: 'Email',
  },
  {
    id: '4',
    title: 'Modules initialization status',
  },
  {
    id: '5',
    title: 'Device registration status',
  },
  {
    id: '6',
    title: 'Topic',
  },
  {
    id: '7',
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
                closeDialog={ () => {onPressButton2()}}>
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

  // const [dialogVisible, setDialogVisibleState] = useState(false);
  // const [dialogTitle, setDialoTitleState] = useState('');
  // const [dialogButton1Action,setDialogButton1Action] = useState(()=>{})
  // const [dialogButton2Action,setDialogButton2Action] = useState(()=>{})

  // state = {
  //   dialogVisible: false,
  //   dialogTitle:''
  // };

  
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
               button1 = 'Ok'
               button2 = 'Cancel'
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
