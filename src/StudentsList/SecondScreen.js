import { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TextInput, FlatList, Alert} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import Student from './Student';

const CONTENT_SIZE = responsiveWidth(90);

export default function SecondScreen({ navigation }) {

    const dispatch = useDispatch();
    const [newName, setNewName] = useState("");
    const [defValue, setDefValue] = useState("");
    const [changedIndex, setChangedIndex] = useState();
    const [isNewStudent, setFlag] = useState(true);
    const studentsList = useSelector(state => state.studentsList);
    const textInput = useRef(null);

    const generateRandomString = (length) => {
        const characters =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&()_+|}{[]:?></-=';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    };

    const studentPress = useCallback((name, index) => {
        setFlag(false);
        setDefValue(name);
        setNewName(name);
        setChangedIndex(index);
        textInput.current.focus();
    }, []);

    const changeText = useCallback((text) => {
        setNewName(text);
    }, []);

    const addStudent = useCallback((newName) => {
        if (!newName) {
            Alert.alert('Ooooops', 'Кажется, ты пытаешься создать студента без имени... Не самая лучшая идея.', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'OK',},
            ]);
            return;
        }
        let newStudent = {
            name: newName.trim(),
            isHere: true,
            desc: '',
            flag: null,
            key: generateRandomString(15)
        };
        dispatch({ type: "ADD_STUDENT", payload: newStudent });
        textInput.current.clear();
    }, []);

    const editStudent = useCallback((name, index, studentsList) => {
        if (!name) {
            Alert.alert('Ooooops', 'Кажется, ты пытаешься создать студента без имени... Не самая лучшая идея.', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'OK',},
            ]);
            setDefValue("");
            setFlag(true);
            return;
        }

        let updatedStudents = [...studentsList]; // создаем копию массива
        let newStudent = {
            name: name.trim(),
            isHere: true,
            desc: '',
            flag: null,
            key: generateRandomString(15)
        };
        updatedStudents[index] = newStudent; // изменяем элемент массива
        dispatch({ type: "UPDATE_STUDENTS", payload: updatedStudents });
        textInput.current.clear();
        setDefValue("");
        setFlag(true);
    }, []);

    const dellStudent = useCallback((index) => {  //удаление существующего студента
        dispatch({ type: "DELETE_STUDENT", payload: index });
    }, []);

    const renderItem = ({ item, index }) => {

        const isFirstItem = index === 0;
        const isLastItem = index === studentsList.length - 1;

        return (
            <Student
                item={item}
                index={index}
                flag={item.flag}
                studentPress={studentPress}
                handleLongPress={dellStudent}
                isFirstItem={isFirstItem}
                isLastItem={isLastItem}
            // onDismiss={editStudentFlag}
            />
        )
    };

    // console.log('Render screen with students group');

    return (
        <View style={styles.contaiter}>
            <TextInput
                ref={textInput}
                style={styles.textInput}
                defaultValue={defValue}
                onChangeText={changeText}
                onSubmitEditing={isNewStudent == true ?
                    () => addStudent(newName)
                    :
                    () => editStudent(newName, changedIndex, studentsList)
                }
                autoCapitalize='words'
                placeholder="Новый студент"
                placeholderTextColor="#808080"
            />
            <FlatList
                data={studentsList}
                keyExtractor={item => item.key}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    contaiter: {
        flex: 1,
    },
    separator: {
        alignSelf: 'center',
        backgroundColor: "black",
        height: 1,
        width: CONTENT_SIZE
    },
    textInput: {
        alignSelf: 'center',
        backgroundColor: 'white',
        height: responsiveHeight(7),
        width: CONTENT_SIZE,
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
        paddingHorizontal: 10,
        borderRadius: 15,
        color: 'black',
        fontFamily: 'Inter-Regular',
        fontSize: responsiveFontSize(2.1)
    },
});
