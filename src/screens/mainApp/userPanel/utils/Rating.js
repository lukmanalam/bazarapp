import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { BottomSheet } from "react-native-btr";

const MAX_RATING=[1,2,3,4,5];
const starImageFilled = require('../../../../assets/Rating_Star/star_filled.png');
const starImageCorner = require('../../../../assets/Rating_Star/star_corner.png');

export default function Rating({
    visible,indicator,vendorName,submitRating,toggle,setDefaultRating,defaultRating
}) {

  return (
    <View>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggle}
        onBackdropPress={toggle}
      >
        <View style={styles.card}>
          <Text style={{color:"hotpink",marginTop:10,fontWeight:"600"}}>Review {vendorName}</Text>
          <View style={{justifyContent:"center",flex:1}}>
            <View style={{
                flexDirection:"row",
                alignItems:"center"
            }}>
              {
                MAX_RATING.map((item)=>(
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => setDefaultRating(item)}>
                    <Image
                      style={{width: 30,height: 30,resizeMode: 'cover',marginHorizontal:5}}
                      source={
                        item <= defaultRating
                          ? starImageFilled
                          : starImageCorner
                      }
                    />
                  </TouchableOpacity>
                ))
              }
            </View>
          </View>
          {
            indicator ? <ActivityIndicator style={{marginBottom:20}} size={24} />
            :
            <TouchableOpacity 
            onPress={submitRating}
            style={{
              backgroundColor:"hotpink",
              paddingVertical:5,
              paddingHorizontal:15,
              borderRadius:5,
              marginBottom:10
            }}>
            <Text style={{color:"#fff",fontWeight:"600"}}>Submit</Text>
          </TouchableOpacity>
          }
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    minHeight: 160,
    alignItems: "center",
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
});
