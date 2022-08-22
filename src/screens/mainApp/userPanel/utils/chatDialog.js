import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";


export default function ChatDialog({closeDialog,title,setTitle,msg,setMsg,Name,send,isSend,setSend,INDICATOR2}){


    const sendResponse=()=>{
        setSend;
        return(
            <Text style={styles.isSent}>Your message is successfully sent</Text>
        );
    };

    return(
        <View style={styles.absContainer}>
            <View style={styles.subcontainer}>
                <View style={styles.img} />
                <Text style={styles.NameTxt}>{Name}</Text>
                <View style={styles.titleView}>
                    <Text style={styles.titleTxt}>Title</Text>
                    <TextInput 
                        style={styles.titleInput}
                        placeholder="Message title..."
                        placeholderTextColor="gray"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
                <View style={styles.msgView}>
                    <Text style={styles.msgtxt}>Message</Text>
                    <TextInput 
                        style={styles.msgInput}
                        placeholder="Message..."
                        placeholderTextColor="gray"
                        textAlignVertical="top"
                        multiline
                        value={msg}
                        onChangeText={setMsg}
                    />
                </View>
                <View style={{alignItems:"center",marginVertical:10}}>
                    {
                        INDICATOR2 ? <ActivityIndicator size={30} /> 
                        :
                        <TouchableOpacity
                            style={{backgroundColor:"#f008",borderRadius:5}}
                            disabled={msg !== "" ? false : true}
                            onPress={send}
                        >
                            <Text style={styles.sendtxt}>Send</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={{position:"absolute",right:10,top:10}}>               
                    <TouchableOpacity
                        onPress={closeDialog}
                    >
                        <Entypo name="squared-cross" color="red" size={30} />
                    </TouchableOpacity>
                </View>
                {
                    isSend && sendResponse()
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    absContainer: {
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    subcontainer: {
        backgroundColor: "#fff",
        minHeight: "65%",
        width: "90%",
        borderRadius: 5
    },
    img: {
        height:60,
        width:60,
        borderRadius:30,
        backgroundColor:"gray",
        alignSelf:"center",
        marginTop:10
    },
    isSent: {
        color:"green",
        fontSize:12,
        textAlign:"center",
        marginBottom:10
    },
    sendtxt: {
        marginVertical:10,
        marginHorizontal:20,
        color:"#fff"
    },
    msgInput: {
        borderWidth:0.5,
        width:"65%",
        marginLeft:10,
        borderRadius:10,
        paddingLeft:10,
        color:"#000",
        height:150
    },
    msgtxt: {
        color:"#000",
        fontWeight:"600",
        marginLeft:10,
        marginTop:10
    },
    msgView: {
        flexDirection:"row",
        alignItems:"flex-start",
        marginVertical:10
    },
    titleInput: {
        borderWidth:0.5,
        width:"75%",
        marginLeft:10,
        borderRadius:30,
        paddingLeft:10,
        color:"#000"
    },
    titleTxt: {
        color:"#000",
        fontWeight:"600",
        marginLeft:10
    },
    titleView: {
        flexDirection:"row",
        alignItems:"center",
        marginVertical:10
    },
    NameTxt: {
        color:"gray",
        fontSize:12,
        textAlign: "center",
        marginBottom:10,
        textTransform:"capitalize"
    }
})