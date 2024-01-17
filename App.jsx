import {
    Alert,
    Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Linking
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Ficon from 'react-native-vector-icons/FontAwesome';
import Voice from '@react-native-voice/voice';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const App = () => {
    const [result,setresult]= useState('')
    const [startrec,setstartrec]= useState('')
    const [endrec,setendrec]= useState('')
    const [isrecording,setisrecording]= useState(false)

  useEffect(() => {
    Voice.onSpeechStart = onspeachstart
    Voice.onSpeechEnd = onspeachend
    Voice.onSpeechResults = onspeachresults
  }, []);

  const onspeachstart = (e)=>{
    console.log('speach started')
    console.log('speach start:',e)
    setisrecording(true)
    setstartrec(true)
}

const onspeachend = (e)=>{
    console.log('speach ended')
    console.log('speach end:',e)
    setisrecording(false)
  }
  const onspeachresults = (e)=>{
    console.log('speach result:',e) 
    setresult(e.value[0])
  }

  const startrecording = async()=>{
      try{
        await  Voice.start('en-US');
        
      const result= await check(PERMISSIONS.ANDROID.RECORD_AUDIO)
      if(result==RESULTS.GRANTED){
        console.log(result)
        setresult('')
        setisrecording(true)
      }
      else{
        Alert.alert(
          'Permission Required',
          'You have denied permission to access the Microphone. Please go to app settings and enable the necessary permissions.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openAppSettings },
          ]
        );
      }
    }catch(err){
        console.log('error during start recording',err)
    }
  }

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const stoprecording = async()=>{
    try{
        await Voice.stop();
        setisrecording(false)
        Voice.removeAllListeners()
        
        // setresult('')
    }catch(err){
        console.log('error during stop recording',err)
    }
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View
        style={{
          rowGap: responsiveScreenHeight(1.5),
          width: responsiveScreenWidth(80),
          // height:responsiveScreenWidth(80),
          backgroundColor: 'white',
          borderRadius: responsiveScreenWidth(4),
          alignItems: 'center',
          padding: responsiveScreenWidth(5),
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(3),
              fontWeight: '600',
            }}>
            Note & Dictation
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(2),
              fontWeight: '500',
            }}>
            What did you Discuss?
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(1.7),
              fontWeight: '400',
            }}>
            Enter the note or tap the microphone to record.
          </Text>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: 'lightgrey',
            width: responsiveScreenWidth(60),
            height: responsiveScreenWidth(40),
            borderRadius: responsiveScreenWidth(5),
            padding: responsiveScreenWidth(2),
          }}>
          <TextInput
            value={result}
            multiline
            style={{
              flex: 1,
              verticalAlign:'top'
            }}
            onChangeText={(txt)=>{
                if(txt.includes("\n")){
                  Keyboard.dismiss()
                }else{
                  setresult(txt)
                }
              }}
            placeholder="type here"
          />
        </View>
        <View
          style={{
            rowGap: responsiveScreenHeight(1.5),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={()=>{
                isrecording ? stoprecording() :startrecording()
            }}
            style={{
              width: responsiveScreenWidth(12),
              height: responsiveScreenWidth(12),
              borderRadius: responsiveScreenWidth(10),
              backgroundColor: 'darkorange',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
                {
                    isrecording ?
                    <Ficon
                    name="microphone-slash"
                    color="white"
                    size={responsiveFontSize(3)}
                  />:
                  <Ficon
              name="microphone"
              color="white"
              size={responsiveFontSize(3)}
            />

                }
            
           
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            console.warn(result)
            Alert.alert('Converted Text', result, [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
          
          }}
            style={{
              width: responsiveScreenWidth(50),
              height: responsiveScreenWidth(12),
              borderRadius: responsiveScreenWidth(10),
              backgroundColor: 'skyblue',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontWeight: '600',
                color: 'white',
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
