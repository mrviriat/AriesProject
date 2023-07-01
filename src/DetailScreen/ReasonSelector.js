import React, { useEffect, useRef, useState, useCallback } from 'react'
import { StyleSheet, View, Dimensions, Animated, Easing, Text, Pressable, TextInput } from 'react-native'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from "react-redux";

export default function ReasonSelector({
    visible,
    options,
    duration,
    onClose,
    item,
    studentId,
    lessonKey
}) {

    const dispatch = useDispatch();

    const { height } = Dimensions.get('screen');
    const startPointY = options?.from === 'top' ? -height : height;
    const transY = useRef(new Animated.Value(startPointY));

    useEffect(() => {
        if (visible) {
            startAnimation(0);
            setDescription(item.desc)
        } else {
            startAnimation(startPointY);
        }
    }, [visible]);

    const startAnimation = (toValue) => {
        Animated.timing(transY.current, {
            toValue,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
        }).start();
    };

    const generateBackgroundOpacity = () => {
        if (startPointY >= 0) {
            return transY.current.interpolate({
                inputRange: [0, startPointY],
                outputRange: [0.8, 0],
                extrapolate: 'clamp'
            })
        } else {
            return transY.current.interpolate({
                inputRange: [startPointY, 0],
                outputRange: [0, 0.8],
                extrapolate: 'clamp'
            })
        }
    };

    const [Description, setDescription] = useState();
    const [Changeble, setChangeble] = useState("");

    const changeDescription = useCallback((text) => {
        setChangeble(text);
    }, []);

    const addDescriprion = (text) => {
        setDescription(text);
        console.log("submit Description");
        dispatch({
            type: "CHANGE_DESCRIPTION",
            studentKey: studentId,
            name: item.name,
            isHere: item.isHere,
            desc: text,
            flag: item.flag,
            lessonKey: lessonKey
        });
        setTimeout(onClose, 300);
    };

    return (
        <>
            <Animated.View pointerEvents='none' style={[styles.outerContainer, { opacity: generateBackgroundOpacity() }]} />
            <Animated.View style={[styles.container, { transform: [{ translateY: transY.current }] }]}>
                <View style={styles.innerContainer}>
                    <View style={styles.headContainer}>
                        <Icon name="user-o" size={responsiveHeight(6.5)} color="black" />
                        <Text style={styles.text}>Имя: {item.name}</Text>
                        <Text ellipsizeMode="head" numberOfLines={1} style={styles.text}>Причина: {!Description ? "..." : Description}</Text>
                    </View>
                    <View style={styles.bodyContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Своя причина"
                            placeholderTextColor="#808080"
                            onChangeText={changeDescription}
                            onSubmitEditing={() => addDescriprion(Changeble)}
                        />
                        <View style={styles.rowContainer}>
                            <Pressable
                                onPress={() => addDescriprion("Неуважительная")}
                                style={{ borderRadius: responsiveHeight(1.8), height: responsiveHeight(5.9), width: responsiveWidth(25.64102564102564), backgroundColor: "#ff2a2a", justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={styles.reasonText}>Неуваж.</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => addDescriprion("Уважительная (больничный лист)")}
                                style={{ borderRadius: responsiveHeight(1.8), marginLeft: responsiveWidth(1), height: responsiveHeight(5.9), width: responsiveWidth(43.58974358974359), backgroundColor: "#5fd253", justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={styles.reasonText}>Уваж. (справка)</Text>
                            </Pressable>
                        </View>

                        <View style={styles.rowContainer}>
                            <Pressable
                                onPress={() => addDescriprion("Уважительная (военная кафедра)")}
                                style={{ borderRadius: responsiveHeight(1.8), height: responsiveHeight(5.9), width: responsiveWidth(41.02564102564103), backgroundColor: "#4996ff", justifyContent: 'center', alignItems: 'center', }}
                            >
                                <Text style={styles.reasonText}>Военн. каф.</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => addDescriprion("Уважительная (индивидуальный график)")}
                                style={{ borderRadius: responsiveHeight(1.8), marginLeft: responsiveWidth(1), height: responsiveHeight(5.9), width: responsiveWidth(28.20512820512821), backgroundColor: "#4996ff", justifyContent: 'center', alignItems: 'center', }}
                            >
                                <Text style={styles.reasonText}>Инд. гр.</Text>
                            </Pressable>
                        </View>
                        <Pressable
                            onPress={() => addDescriprion("Уважительная (заявление на имя декана)")}
                            style={{ borderRadius: responsiveHeight(1.8), marginTop: responsiveHeight(1), height: responsiveHeight(5.9), width: responsiveWidth(69.23076923076923) + responsiveWidth(1), backgroundColor: "#5fd253", justifyContent: 'center', alignItems: 'center', }}
                        >
                            <Text style={styles.reasonText}>Уваж. (заявл. декану)</Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2b4369'
    },
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        width: '80%',
        height: responsiveHeight(50),
        backgroundColor: '#D9D9D9',
        borderRadius: responsiveHeight(1.8)
    },
    headContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "black",
    },
    bodyContainer: {
        flex: 6,
        alignItems: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(1)
    },
    textInput: {
        width: responsiveWidth(70.6),
        height: responsiveHeight(5.9),
        backgroundColor: 'white',
        marginTop: responsiveHeight(1),
        borderRadius: responsiveHeight(1.8),
        fontSize: responsiveFontSize(2.1),
        color: 'black',
        fontFamily: 'Inter-Regular'
    },
    text: {
        fontFamily: 'Inter-Regular',
        fontSize: responsiveFontSize(2.67),
        color: "black",
        alignSelf: 'flex-start',
        marginLeft: responsiveWidth(1)
    },
    reasonText: {
        fontFamily: 'Inter-Regular',
        fontSize: responsiveFontSize(2.67),
        color: "white"
    },
})