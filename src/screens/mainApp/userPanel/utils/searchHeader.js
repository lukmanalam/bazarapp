import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";


export default function SearchHeader({nav,LOCATION,U_NAME,expand,SET_Expand,isU_Name,ready}){

    return(
        <View style={styles.header}>
            <TouchableOpacity 
                style={{flexDirection:"row",alignItems:"flex-start"}}
                activeOpacity={0.8}
                onPress={SET_Expand}
            >
                <EvilIcons name="location" color="#000" size={24} />
                {
                    !ready ?
                    <ActivityIndicator style={{marginHorizontal:20}} />
                    :
                    expand 
                    ? 
                    <View>
                        <Text style={styles.text1}>{U_NAME}</Text>
                        <Text style={styles.text2}>{LOCATION}</Text>
                    </View>
                    :
                    <View>
                        {
                            isU_Name ? 
                            <Text style={styles.text3}>{U_NAME}</Text>
                            :
                            <Text style={styles.text4}>{LOCATION}</Text>
                        }
                    </View>
                }
                <Entypo 
                    name={expand ? "chevron-thin-up" : "chevron-thin-down"} 
                    color="#000" 
                    style={{marginTop:2}} size={16} 
                />
            </TouchableOpacity>
            <Fontisto name="bell" color="#000" size={24} onPress={nav} />
        </View>
    );
};
const styles = StyleSheet.create({
    header: {
        marginVertical: 30,
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text1: {
        color:"#000",
        fontSize:12,
        marginLeft:10,
        fontWeight:"600",
        letterSpacing:1,
        textTransform: 'capitalize'
    },
    text2: {
        color:"#000",
        fontSize:12,
        marginLeft:10,
        fontWeight:"600"
    },
    text3: {
        color:"#000",
        fontSize:12,
        marginHorizontal:10,
        fontWeight:"600",
        letterSpacing:1,
        textTransform: 'capitalize'
    },
    text4: {
        color:"#000",
        fontSize:12,
        marginHorizontal:10,
        fontWeight:"600"
    }
})