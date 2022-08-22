/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";

PushNotification.configure({
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
    },
    requestPermissions: Platform.OS === 'ios'
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const preMsg = await AsyncStorage.getItem('notifications');
    const parse = JSON.parse(preMsg);
    if(parse){
        const messageArray = parse;
        messageArray.push(remoteMessage);
        console.log("arr",messageArray);
        await AsyncStorage.setItem('notifications', JSON.stringify(messageArray));
    }
    else{
        const messageArray = [remoteMessage];
        await AsyncStorage.setItem('notifications', JSON.stringify(messageArray));
    }
});

AppRegistry.registerComponent(appName, () => App);

