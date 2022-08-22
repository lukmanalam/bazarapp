import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorChat from '../ChatScreen';
import AlertScreen from '../AlertScreen';
import ProfileScreen from '../ProfileScreen';
import EditProfile from '../EditProfileScreen';
import ChatRoom from '../ChatRoom';




export default function ChatStack(){

  
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='ChatScreen' component={VendorChat} />
            <Stack.Screen name='AlertScreen' component={AlertScreen} />
            <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='ChatRoom' component={ChatRoom} />
        </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#054d36"
  }
});