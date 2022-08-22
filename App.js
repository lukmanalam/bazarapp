import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import SignIn from './src/screens/SigninScreen';
import OtpVerify from './src/screens/OtpScreen';
import UserPanel from './src/screens/mainApp/userPanel';
import VendorPanel from './src/screens/mainApp/vendorPanel';
import Categories from './src/screens/mainApp/userPanel/CategoriesScreen';
import ChatRoom from './src/screens/mainApp/userPanel/ChatRoom';
import AlertScreen from './src/screens/mainApp/userPanel/AlertScreen';
import Services from './src/screens/mainApp/userPanel/ServiceScreen';
import ProductDetails from './src/screens/mainApp/userPanel/ProductDetails';
import SplashScreen from './src/screens/SplashScreen';
import ProductDetailsVendor from './src/screens/mainApp/vendorPanel/ProductDetails';
import ServiceDetails from './src/screens/mainApp/userPanel/ServiceDetails';
import MyCart from './src/screens/mainApp/userPanel/MyCart';
import MyCartService from './src/screens/mainApp/userPanel/MyCartService';

const App = () => {
  
  const Stack = createNativeStackNavigator();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');

  Geocoder.init('AIzaSyADsP1zSHCrMeyM2spsz4uwRj0PVnQlNx0');

  Geolocation.getCurrentPosition(info => {
    Geocoder.from(info.coords.latitude, info.coords.longitude)
      .then(json => {
        // console.log(json.results[3].formatted_address);
        let LOCATION = {
          // city: json.results[0].address_components[1].long_name,
          // state: json.results[0].address_components[3].long_name,
          // country: json.results[0].address_components[4].short_name,
          location:json.results[3].formatted_address,
          lat: info.coords.latitude,
          long: info.coords.longitude
        };
        try {
          AsyncStorage.setItem('location', JSON.stringify(LOCATION));
        } catch (err) {
          console.log('storage err: ', err);
        }
      })
      .catch(error => console.warn(error));
  });

  //......useEffect hook....................................
  useEffect(() => {
    getToken();
    setTimeout(() => {
      setLoading(false);
    }, 5000); // loading will be hold for 5s
    cloudMessage();
    getFCM();  
  }, []);

  const unsubscribe = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived :', remoteMessage);
      const preMsg = await AsyncStorage.getItem('notifications');
      const parse = JSON.parse(preMsg);
      if (parse) {
        const messageArray = parse;
        messageArray.push(remoteMessage);
        console.log('arr', messageArray);
        await AsyncStorage.setItem(
          'notifications',
          JSON.stringify(messageArray),
        );
      } else {
        const messageArray = [remoteMessage];
        await AsyncStorage.setItem(
          'notifications',
          JSON.stringify(messageArray),
        );
      }
    });
    return unsubscribe;
  };

  //........ permission for push notification for IOS only.........
  const cloudMessage = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('auth status: ', authStatus);
    }
  };
  //.........get fcm token from firebase............
  const getFCM = async () => {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      //  console.log("FCMtoken: ",fcmToken);  // send token to server
      messaging().subscribeToTopic('topic');
    } else {
      console.log('token not found');
    }
  };
  //........get user from asyncstorage.................
  const getToken = async () => {
    try {
      const Json = await AsyncStorage.getItem('jwt');
      const role = await AsyncStorage.getItem('userRole');
      const Parsed = JSON.parse(Json);
      setToken(Parsed);
      role === '0' ? setUser('user') : setUser('vendor');
    } catch (e) {
      console.log('Token Error: ', e);
    }
  };
  //..........render splash screen for 5s..................
  if (loading) {
    return <SplashScreen />;
  }
  //..............main return.....................
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          !token ? 'SignIn' : user === 'user' ? 'UserPanel' : 'VendorPanel'
        }
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="OtpVerify" component={OtpVerify} />
        <Stack.Screen name="UserPanel" component={UserPanel} />
        <Stack.Screen name="Alert" component={AlertScreen} />
        <Stack.Screen name="VendorPanel" component={VendorPanel} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="Services" component={Services} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="MyCart" component={MyCart} />
        <Stack.Screen name="MyCartService" component={MyCartService} />
        {/* <Stack.Screen
          name="ProductDetailsVendor"
          component={ProductDetailsVendor}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
