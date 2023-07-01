import { useState, useRef, useCallback, memo } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Platform, StatusBar, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { useDispatch } from "react-redux";
import Icon from 'react-native-vector-icons/AntDesign';

const LIST_ITEM_HEIGHT = responsiveHeight(7.109);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.2;
const CONTENT_SIZE = responsiveWidth(90);

function ReasonStudent({
    item,
    index,
    studentId,
    lessonId,
    isFirstItem,
    isLastItem,
    openSelector,
}) {

    const dispatch = useDispatch();

    const handlePress = () => {
        console.log("pressed");
        dispatch({
            type: "CHANGE_PRESENT",
            studentKey: studentId,
            name: item.name,
            isHere: item.isHere,
            desc: item.desc,
            flag: item.flag,
            lessonKey: lessonId
        });
    };

    const startSelector = () => {
        openSelector(item, studentId);
    };

    console.log(studentId + ". в детальном списке " + item.name);

    return (
        <Pressable style={[
            styles.item,
            {
                opacity: item.isHere ? 1 : 0.5,
                borderBottomLeftRadius: isLastItem ? 15 : 0,
                borderBottomRightRadius: isLastItem ? 15 : 0,
                borderTopLeftRadius: isFirstItem ? 15 : 0,
                borderTopRightRadius: isFirstItem ? 15 : 0,
                marginBottom: isLastItem ? responsiveHeight(2) : 0,
                marginTop: isFirstItem ? responsiveHeight(2) : 0,
            }
        ]
        }
            onPress={handlePress}
        >
            <Text style={styles.text}>{index + 1}. </Text>
            <Text style={styles.text}>{item.name}</Text>
            {!item.isHere &&
                <Pressable onPress={startSelector} style={styles.idcard}>
                    <Icon name="idcard" size={responsiveHeight(3.9)} color={!item.desc ? "black" : "green"} />
                </Pressable>
            }
        </Pressable>
    );
};

export default memo(ReasonStudent);

const styles = StyleSheet.create({
    contaiter: {
        flex: 1,
    },
    text: {
        fontFamily: 'Inter_400Regular',
        fontSize: responsiveFontSize(2.67),
    },
    input: {
        width: responsiveWidth(92.308), //360
        height: responsiveHeight(7.109), //60
        borderBottomLeftRadius: responsiveHeight(0.5924), //5
        borderTopRightRadius: responsiveHeight(0.5924), //5
        borderBottomWidth: responsiveHeight(0.237), //2
        borderLeftWidth: responsiveHeight(0.237), //2
        padding: responsiveWidth(2.56), //10
        borderColor: 'grey',
        backgroundColor: '#ffffff90',
        fontFamily: 'Inter_400Regular',
        fontSize: responsiveFontSize(2.1),
    },
    separator: {
        alignSelf: 'center',
        backgroundColor: "black",
        height: 1,
        width: CONTENT_SIZE
    },
    studentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Inter_400Regular',
        fontSize: responsiveFontSize(2.67),
        color: 'black'
    },
    flag: {
        position: 'absolute',
        right: '5%',
    },
    item: {
        width: CONTENT_SIZE, //360
        height: LIST_ITEM_HEIGHT, //60
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: responsiveWidth(5.55), //20
        alignSelf: 'center'
    },
    leftTouch: {
        height: LIST_ITEM_HEIGHT,
        width: responsiveHeight(8),
        position: 'absolute',
        left: '0%',
        // backgroundColor: 'red'
    },
    rightTouch: {
        height: LIST_ITEM_HEIGHT,
        width: responsiveHeight(8),
        position: 'absolute',
        right: '0%',
        // backgroundColor: 'red'
    },
    iconContainerRight: {
        height: LIST_ITEM_HEIGHT,
        width: LIST_ITEM_HEIGHT,
        position: 'absolute',
        right: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainerLeft: {
        height: LIST_ITEM_HEIGHT,
        width: LIST_ITEM_HEIGHT,
        position: 'absolute',
        left: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: CONTENT_SIZE,
        height: responsiveHeight(7),
        backgroundColor: 'white',
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
        borderRadius: 15,
        fontSize: responsiveFontSize(2.1),
        paddingHorizontal: 10,
        color: 'black',
        fontFamily: 'Inter-Regular',
        alignSelf: 'center'
    },
    idcard: {
        position: 'absolute',
        right: 0,
        height: responsiveHeight(7.109),
        width: responsiveHeight(7.109),
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
    },
    // item: {
    //     width: responsiveWidth(92.308), //360
    //     height: responsiveHeight(7.109), //60
    //     backgroundColor: '#D9D9D9',
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     paddingLeft: responsiveWidth(5.55), //20
    //     // marginHorizontal: responsiveWidth(3.846),
    // },
});
