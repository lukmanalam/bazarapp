import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';


import ChatRoomHeader from './utils/chatRoomHeader';
import axios from 'axios';
import {API, API_USER} from '../../../../config';
import Rating from './utils/Rating';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatRoom({route, navigation}) {
  const preData = route.params;
  const [messages, setMessages] = useState([]);
  const [rating, setRating] = useState([]);
  const [isPopUp, setIsPopUP] = useState(false);
  const [visible, setVisible] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [defaultRating, setDefaultRating] = useState(0);
  const Firestore = firestore();
  Firestore.settings({ ignoreUndefinedProperties: true });


  useEffect(() => {
    getChats();
  }, []);

 

  const scrollToBottom = () => (
    <FontAwesome name="angle-double-down" size={22} color="#333" />
  );
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#ffe4e1',
            borderRadius: 5,
          },
          left: {
            backgroundColor: '#ffe4e1',
            borderRadius: 5,
          },
        }}
        textStyle={{
          right: {
            color: '#000',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  const pop_up = () => (
    <TouchableWithoutFeedback onPress={() => setIsPopUP(false)}>
      <View style={styles.absPop}>
        <TouchableOpacity style={styles.popView} activeOpacity={1}>
          <TouchableOpacity
            style={styles.subViewPop}
            onPress={openDialer}
            activeOpacity={0.6}>
            <Feather name="phone-call" color="#000" size={20} />
            <Text style={{color: '#000', marginLeft: 10, fontWeight: '500'}}>
              Call vendor
            </Text>
          </TouchableOpacity>
          <View style={{width:"100%",alignItems:"center"}}>
            <View style={{width:"90%",borderWidth:0.5}} />
          </View>
          <TouchableOpacity
            style={styles.subViewPop}
            onPress={toggle}
            activeOpacity={0.6}>
            <AntDesign name="staro" color="#000" size={20} />
            <Text style={{color: '#000', marginLeft: 10, fontWeight: '500'}}>
              Give rating
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const openDialer = () => {
    let number = preData.vendorData.phoneNo;
    if (Platform.OS === 'ios') {
      number = `telprompt:${number}`;
    } else number = `tel:${number}`;
    Linking.openURL(number);
  };

  const getChats = async() => {
    const docId =
      preData.vendorData._id > preData.totalData._id
        ? preData.totalData._id + '-' + preData.vendorData._id
        : preData.vendorData._id + '-' + preData.totalData._id;
   const querySnap =  await firestore().collection("CHAT")
    .doc(docId)
    .collection("MSG")
    .orderBy('createdAt',"desc")
    .get()
   const allMsg = querySnap.docs.map(item=>{
      return {
        ...item.data(),
        createdAt: item.data().createdAt.toDate()
      }
    })
    setMessages(allMsg);
  };

  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    const myMsg = {
      ...msg,
      receiver: {
        _id: preData.vendorData._id,
        name: preData.vendorData.name,
        avatar: preData.vendorData.profileImg,
        phoneNo: preData.vendorData.phoneNo
      },
      sender: {
        _id: preData.totalData._id,
        name: preData.totalData.name,
        avatar: preData.totalData.profileImg,
        phoneNo: preData.totalData.phoneNo
      }
    };
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    const docId =
      preData.vendorData._id > preData.totalData._id
        ? preData.totalData._id + '-' + preData.vendorData._id
        : preData.vendorData._id + '-' + preData.totalData._id;
        console.log(myMsg);
    firestore()
      .collection('CHAT')
      .doc(docId)
      .collection('MSG')
      .add({...myMsg, createdAt: firestore.FieldValue.serverTimestamp()})
      .then(async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
          headers:{
            Authorization: parsed.token
          }
        };
        axios.post(`${API}/firebasemessage`,myMsg,axiosConfig)
        .then(res=>{
          console.log(res.data);
        })
        .catch(err=>{
          console.log(err);
        })
      })
  }, []);

  const toggle=()=>{
    setVisible((visible) => !visible)
  };



  let ratingData={
    rating: defaultRating,
    vendorId: preData.vendorData._id
  };

  const _submitRating=async()=>{
    setIndicator(true);
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers:{
        Authorization: parsed.token
      }
    };
    axios.patch(`${API_USER}/vendorreview`,ratingData,axiosConfig)
    .then(resp=>{
      console.log(resp.data);
      setIndicator(false);
      setTimeout(()=>{
        setVisible(false);
      },1500)
    })
    .catch(err=>{
      console.log("err",err);
      setIndicator(false);
    })
  };

  return (
    <View style={styles.container}>
      <ChatRoomHeader
        name={preData.vendorData.name ? preData.vendorData.name : `Vendor${preData.vendorData._id.split("",2)}**`}
        back={() => navigation.goBack()}
        pop_up={() => setIsPopUP(true)}
      />
      <View style={styles.body}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: preData.totalData._id,
            avatar: preData.totalData.profileImg,
            name: preData.totalData.name,
          }}
          textInputStyle={{color: '#000'}}
          scrollToBottom={true}
          scrollToBottomComponent={scrollToBottom}
          renderBubble={renderBubble}
          showUserAvatar
          renderAvatarOnTop
          isTyping={true}
        />
      </View>
      {isPopUp && pop_up()}
      <Rating 
          visible={visible}
          toggle={toggle}
          vendorName={preData.vendorData.name}
          indicator={indicator}
          submitRating={_submitRating}
          defaultRating={defaultRating}
          setDefaultRating={setDefaultRating}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '##f0f0f3',
  },
  body: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  toolbar: {
    height: 60,
    backgroundColor: '#aaa',
  },
  composer: {},
  absPop: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'flex-end',
  },
  popView: {
    // maxHeight: 150,
    width: 150,
    backgroundColor: '#fff',
    right: 20,
    top: 30,
    borderRadius: 5,
  },
  subViewPop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
});
