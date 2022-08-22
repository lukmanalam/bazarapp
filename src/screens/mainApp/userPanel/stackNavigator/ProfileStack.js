import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../ProfileScreen';
import EditProfile from '../EditProfileScreen';
import WishListScreen from '../WishListScreen';

// import Menu from '../MenuScreen';



export default function ProfileStack(){

  
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='WishList' component={WishListScreen} />
        </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe4e1"
  }
});
