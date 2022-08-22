import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../HomeScreen';
import AlertScreen from '../AlertScreen';
import ProfileScreen from '../ProfileScreen';
import EditProfile from '../EditProfileScreen';
import MyProduct from '../utils/MyProducts.';
import AddProduct from '../AddProduct';
import Services from '../ServiceScreen';
import AddService from '../AddService';
import EditService from '../EditService';



export default function ServiceStack(){

  
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
        <Stack.Navigator 
            screenOptions={{headerShown:false}}
            initialRouteName="ServiceScreen"
        >
            <Stack.Screen name='AlertScreen' component={AlertScreen} />
            <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='ServiceScreen' component={Services} />
            <Stack.Screen name='addServiceScreen' component={AddService} />
            <Stack.Screen name='editService' component={EditService} />
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
