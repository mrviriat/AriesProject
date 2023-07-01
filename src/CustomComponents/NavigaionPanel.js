import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { format, eachWeekOfInterval } from 'date-fns';
import ru from 'date-fns/locale/ru';
import { useSelector, useDispatch } from 'react-redux';
import ExcelJS from 'exceljs';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Buffer as NodeBuffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'

export default function NavigaionPanel({ navigation }) {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.userData);
    const semesterStartDate = useSelector(state => state.semesterStartDate)
    const studentsList = useSelector(state => state.studentsList);
    const daysKey = useSelector(state => state.daysKey);
    const dayDataByKey = useSelector(state => state.dayDataByKey);
    const lessonsByIdData = useSelector(state => state.lessonsByIdData);

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const goReg = () => {
        navigation.navigate("Third")
    };

    const dateAlert = () => {
        if (!semesterStartDate) {
            return false;
        }

        const weeksAmount = eachWeekOfInterval({
            start: new Date(semesterStartDate),
            end: new Date(),
        },
            {
                weekStartsOn: 1,
            }
        );
        if (weeksAmount.length > 18) {
            return true;
        }
        return false;
    };

    const createAndShareExcelFile = async () => {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        worksheet.columns = [
            { header: 'Имя студента', key: 'name', width: 30 },
            { header: 'Дата пропуска', key: 'dat', width: 30 },
            { header: 'Кол-во часов', key: 'hour', width: 16 },
            { header: 'Название дисциплины', key: 'less', width: 70, },
            { header: 'Причина пропуска', key: 'desc', width: 50, }
        ];

        studentsList.forEach(student => {
            let lastUsedName;
            let lastUsedDate;
            let lastUsedDescription;
            daysKey.forEach(dayInfo => {
                dayDataByKey[dayInfo.key].forEach(lessonKey => {

                    if (lessonsByIdData[lessonKey].students.dataById[student.key]) {
                        const selectedStudent = lessonsByIdData[lessonKey].students.dataById[student.key];
                        if (!selectedStudent.isHere) {
                            let date;
                            let description = "";
                            let name = "";
                            if (lastUsedName != selectedStudent.name) { name = selectedStudent.name }
                            if (lastUsedDate != dayInfo.day) { date = dayInfo.day }
                            if (lastUsedDescription != selectedStudent.desc && selectedStudent.desc) { description = selectedStudent.desc }

                            worksheet.addRow({ name: name, dat: date ? format(new Date(date), 'PPPP', { locale: ru }) : "", hour: 2, less: lessonsByIdData[lessonKey].title, desc: description });
                            lastUsedDate = dayInfo.day;
                            if (selectedStudent.desc) { lastUsedDescription = selectedStudent.desc }
                            lastUsedName = selectedStudent.name;
                        }
                    }
                })
            });
            if (student.name == lastUsedName) {
                worksheet.addRow({ name: "", dat: "", hour: "", less: "", desc: "" });
            }
        });

        // Style first row
        worksheet.getRow(1).font = {
            size: 14, bold: true
        };

        const buffer = await workbook.xlsx.writeBuffer();

        const nodeBuffer = NodeBuffer.from(buffer);
        const bufferStr = nodeBuffer.toString('base64');

        const weeksAmount = eachWeekOfInterval({
            start: new Date(semesterStartDate),
            end: new Date(),
        },
            {
                weekStartsOn: 1,
            }
        );

        const excelName = `${weeksAmount.length}_${userData.fullname.split(" ")[0]}_${userData.grouptitle}.xlsx`;
        const path = RNFS.CachesDirectoryPath + `/${excelName}`;

        await RNFS.writeFile(path, bufferStr, 'base64')
            // .then((success) => {
            //     console.log('FILE WRITTEN!');
            // })
            .catch((err) => {
                console.log(err.message);
            });

        const options = {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            url: `file://${path}`,
            title: 'Excel File',
        };

        try {
            await Share.open(options);
        } catch (err) {
            console.log(err);
        }
    };

    const confirmDate = useCallback((date) => {
        let nowDate = new Date();
        if (nowDate < date) {
            Alert.alert('Oooops', 'Вы не можете указывать дату начала семестра, который ещё не начался.', [
                {
                    text: 'Я понял',
                },
                {
                    text: ':(',
                }
            ]);
            setOpen(false);
            return;
        }
        setOpen(false);
        dispatch({ type: "UPDATE_DATE", date: date });
        AsyncStorage.setItem('@semesterSatrt', JSON.stringify(date));
    }, []);

    const openDate = useCallback(() => {
        setOpen(true);
    }, []);

    const closeDate = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                onPress={openDate}
                style={[styles.registerButton, { marginRight: "2%" }]}
            >
                {
                    dateAlert() ?
                        <View style={{ position: 'absolute', right: 0, bottom: 2 }}>
                            <Icon name="exclamationcircle" size={20} color='red' />
                        </View>
                        :
                        null
                }

                <Icon name="calendar" size={34} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={createAndShareExcelFile}
                style={[styles.registerButton, { marginRight: "2%" }]}
            >
                <Icon name="export" size={36} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={goReg}
                style={[styles.registerButton, { marginRight: "5%" }]}
            >
                {
                    userData ?
                        <Icon name="smileo" size={32} color='black' />
                        :
                        <Icon name="frowno" size={32} color="black" />
                }
            </TouchableOpacity>
            <DatePicker
                modal
                mode="date"
                locale="ru"
                title="Дата начала семестра"
                open={open}
                date={date}
                onConfirm={confirmDate}
                onCancel={closeDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    registerButton: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "red",
        // borderWidth: 1,
    },
});