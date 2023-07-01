import { useCallback, memo } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { useDispatch } from "react-redux";
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LIST_ITEM_HEIGHT = responsiveHeight(7.109);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.2;
const CONTENT_SIZE = responsiveWidth(90);


function Student({
    item,
    index, 
    flag,
    isFirstItem,
    isLastItem,
    studentPress,
    handleLongPress,
}) {
    // console.log(index + ". студент " + item.name);

    const dispatch = useDispatch();

    const changeFlag = useCallback((index, flag) => {
        // console.log(`index - ${index}; flag - ${flag}`);
        dispatch({ type: "CHANGE_FLAG", index: index, flag: flag });
    }, []);

    const translateX = useSharedValue(0);
    const panGesture = useAnimatedGestureHandler({
        onActive: (event) => {
            translateX.value = event.translationX;
        },
        onEnd: () => {
            const shouldBeTwo = translateX.value < -TRANSLATE_X_THRESHOLD;
            const shouldBeOne = translateX.value > TRANSLATE_X_THRESHOLD;
            if (shouldBeTwo) {
                runOnJS(changeFlag)(index, 2);
            } else if (shouldBeOne) {
                runOnJS(changeFlag)(index, 1);
            }
            translateX.value = withTiming(0);
        },
    });

    const rStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
        ],
    }));

    const rIconLeftContainerStyle = useAnimatedStyle(() => {
        const opacity = withTiming(
            translateX.value > TRANSLATE_X_THRESHOLD ? 1 : 0
        );
        return { opacity };
    });

    const rIconRightContainerStyle = useAnimatedStyle(() => {
        const opacity = withTiming(
            translateX.value < -TRANSLATE_X_THRESHOLD ? 1 : 0
        );
        return { opacity };
    });

    return (
        <View style={styles.studentContainer}>
            <Animated.View style={[
                styles.iconContainer,
                rIconLeftContainerStyle,
                { marginTop: index == 0 ? responsiveHeight(1.5) : 0, left: '5%' }
            ]}>
                <Icon
                    name="looks-one"
                    size={responsiveHeight(7.109) * 0.6}
                    color="black"
                />
            </Animated.View>
            <Animated.View style={[
                styles.iconContainer,
                rIconRightContainerStyle,
                { marginTop: index == 0 ? responsiveHeight(1.5) : 0, right: '5%' }
            ]}>
                <Icon
                    name="looks-two"
                    size={responsiveHeight(7.109) * 0.6}
                    color="black"
                />
            </Animated.View>
            <Animated.View style={rStyle}>
                <TouchableOpacity style={[
                    styles.item,
                    {
                        borderBottomLeftRadius: isLastItem ? 15 : 0,
                        borderBottomRightRadius: isLastItem ? 15 : 0,
                        borderTopLeftRadius: isFirstItem ? 15 : 0,
                        borderTopRightRadius: isFirstItem ? 15 : 0,
                        marginBottom: isLastItem ? responsiveHeight(2) : 0,
                        marginTop: isFirstItem ? responsiveHeight(2) : 0,
                    }
                ]
                }
                    onPress={() => studentPress(item.name, index)}
                    delayLongPress={500}
                    onLongPress={() => handleLongPress(index)}
                >
                    <Text style={styles.text}>{index + 1}. </Text>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={[styles.text, styles.flag]}>{flag} </Text>

                    <PanGestureHandler onGestureEvent={panGesture}>
                        <Animated.View style={styles.leftTouch} />
                    </PanGestureHandler>
                    <PanGestureHandler onGestureEvent={panGesture}>
                        <Animated.View style={styles.rightTouch} />
                    </PanGestureHandler>
                </TouchableOpacity>
            </Animated.View >
        </View>
    );
};

export default memo(Student);

const styles = StyleSheet.create({
    studentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Inter-Regular',
        fontSize: responsiveFontSize(2.67),
        color: 'black'
    },
    flag: {
        position: 'absolute',
        right: '5%',
    },
    item: {
        width: CONTENT_SIZE,
        height: LIST_ITEM_HEIGHT,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: responsiveWidth(5.55),
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
    iconContainer: {
        height: LIST_ITEM_HEIGHT,
        width: LIST_ITEM_HEIGHT,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
