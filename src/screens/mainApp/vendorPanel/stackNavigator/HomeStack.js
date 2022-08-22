import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../HomeScreen';
import AlertScreen from '../AlertScreen';
import ProfileScreen from '../ProfileScreen';
import EditProfile from '../EditProfileScreen';
import MyProduct from '../utils/MyProducts.';
import AddProduct from '../AddProduct';
import EditService from '../EditService';
import EditProduct from '../EditProduct';
import ProductDetailsVendor from '../ProductDetails';



export default function HomeStack(){

  
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='AlertScreen' component={AlertScreen} />
            <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='VendorProducts' component={MyProduct} />
            <Stack.Screen name='addProductScreen' component={AddProduct} />
            <Stack.Screen name='editService' component={EditService} />
            <Stack.Screen name='EditProduct' component={EditProduct} />
            <Stack.Screen name='ProductDetailsVendor' component={ProductDetailsVendor} />
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
