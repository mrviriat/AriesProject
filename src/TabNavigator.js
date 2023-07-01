import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eachWeekOfInterval, eachDayOfInterval, addDays, format } from 'date-fns';
import getDay from 'date-fns/getDay';
import isEqual from 'date-fns/isEqual';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen';
import { StackScreenA, StackScreenB } from './SharedScreens';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {

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

    const createEmptyKeys = (date) => {
        let empty = [];

        for (let i = 0; i < 7; i++) {
            let changeble = {
                day: date[i],
                key: generateRandomString(15)
            }
            empty = [...empty, changeble]
        }

        return empty;
    };

    let week = eachWeekOfInterval({
        // start: new Date("2023-05-08T15:35:50.041Z"),
        // end: new Date("2023-05-08T15:35:50.041Z"),
        start: new Date(),
        end: new Date(),
    },
        {
            weekStartsOn: 1,
        }
    );

    let date = eachDayOfInterval({
        start: week[0],
        end: addDays(week[0], 6)
    });

    const dispatch = useDispatch();

    const selectedId = (getDay(new Date()) + 6) % 7;
    // const selectedId = 3;
    const userData = useSelector(state => state.userData);
    const isEdited = useSelector(state => state.isEdited);

    const getUserWeek = async (InUser, jsonGroup) => { //обновление недели

        let dateStart = `${format(date[0], 'dd')}.${format(date[0], 'LL')}.${format(date[0], 'uuuu')}`;
        let dateEnd = `${format(date[5], 'dd')}.${format(date[5], 'LL')}.${format(date[5], 'uuuu')}`;

        // let dateStart = "08.05.2023";
        // let dateEnd = "14.05.2023";

        // console.log(InUser.k_sgryp);
        // console.log(dateStart);
        // console.log(dateEnd);
        // console.log("Начинаю запрос на сервер.");

        let { data: { days } } = await axios.get(`http://api.grsu.by/1.x/app1/getGroupSchedule?groupId=${InUser.k_sgryp}&dateStart=${dateStart}&dateEnd=${dateEnd}&lang=ru_RU`);

        // console.log("Успешный запрос на сервер!");

        let groupCopy = [];

        if (jsonGroup) {
            groupCopy = jsonGroup;
        }

        // const jsonAxiosData = JSON.stringify(days);
        // await AsyncStorage.setItem('@jsonAxiosData', jsonAxiosData);

        const daysKey = createEmptyKeys(date);

        const dayDataByKey = daysKey.reduce((obj, item) => {
            obj[item.key] = [];
            return obj;
        }, {});

        const lessonsByIdData = {};

        for (let i = 0; i < days.length; i++) {

            const index = daysKey.findIndex((item) =>
                `${format(item.day, 'uuuu')}-${format(item.day, 'LL')}-${format(item.day, 'dd')}`
                ==
                days[i].date
            );

            days[i].lessons = days[i].lessons.filter(lesson => lesson.title != "Физическая культура");

            for (let j = 0; j < days[i].lessons.length; j++) {
                let group = JSON.parse(groupCopy);
                if (days[i].lessons[j].subgroup.title) {
                    if (days[i].lessons[j].subgroup.title.slice(-1) == 1) {
                        group = group.filter(student => student.flag == 1);
                    } else {
                        group = group.filter(student => student.flag == 2);
                    }
                }

                const warField = {
                    listId: [],
                    dataById: {}
                }

                group.forEach(element => {
                    warField.listId.push(element.key);
                    warField.dataById = {
                        ...warField.dataById,
                        [element.key]: {
                            name: element.name,
                            isHere: element.isHere,
                            desc: element.desc,
                            flag: element.flag
                        }
                    }
                });

                const lessonId = generateRandomString(15);
                dayDataByKey[daysKey[index].key].push(lessonId);
                lessonsByIdData[lessonId] = {
                    title: days[i].lessons[j].title,
                    type: days[i].lessons[j].type,
                    timeStart: days[i].lessons[j].timeStart,
                    timeEnd: days[i].lessons[j].timeEnd,
                    students: warField,
                }
            }
        };
        // console.log(JSON.stringify(dayDataByKey, null, 4)); // Logs output to dev tools console.
        // console.log(JSON.stringify(lessonsByIdData, null, 4)); // Logs output to dev tools console.

        dispatch({
            type: "SET_DATA",
            keys: daysKey,
            dataByKeys: dayDataByKey,
            lessonsData: lessonsByIdData
        });

        const jsonDaysKey = JSON.stringify(daysKey);
        const jsonDayDataByKey = JSON.stringify(dayDataByKey);
        const jsonLessonsByIdData = JSON.stringify(lessonsByIdData);
        await AsyncStorage.setItem('@daysKey', jsonDaysKey);
        await AsyncStorage.setItem('@dayDataByKey', jsonDayDataByKey);
        await AsyncStorage.setItem('@lessonsByIdData', jsonLessonsByIdData);

        const jsonCurrentWeek = JSON.stringify(date);
        const jsonCurrentDay = JSON.stringify(selectedId);
        await AsyncStorage.setItem('@lastWeek', jsonCurrentWeek);
        await AsyncStorage.setItem('@lastDay', jsonCurrentDay);
        // console.log('я сохранил lastWeek и lastDay');
    };

    const getUserDay = async (InUser, jsonGroup) => { //обновление одного дня

        let dateStart = `${format(date[0], 'dd')}.${format(date[0], 'LL')}.${format(date[0], 'uuuu')}`;
        let dateEnd = `${format(date[5], 'dd')}.${format(date[5], 'LL')}.${format(date[5], 'uuuu')}`;

        const jsonDaysKey = await AsyncStorage.getItem('@daysKey');
        const jsonDayDataByKey = await AsyncStorage.getItem('@dayDataByKey');
        const jsonLessonsByIdData = await AsyncStorage.getItem('@lessonsByIdData');
        const daysKey = JSON.parse(jsonDaysKey);
        const dayDataByKey = JSON.parse(jsonDayDataByKey);
        const lessonsByIdData = JSON.parse(jsonLessonsByIdData);

        let { data: { days } } = await axios.get(`http://api.grsu.by/1.x/app1/getGroupSchedule?groupId=${InUser.k_sgryp}&dateStart=${dateStart}&dateEnd=${dateEnd}&lang=ru_RU`);
        // console.log(days);
        let groupCopy = [];

        if (jsonGroup) {
            groupCopy = jsonGroup;
        }

        const today = `${format(new Date(daysKey[selectedId].day), 'uuuu')}-${format(new Date(daysKey[selectedId].day), 'LL')}-${format(new Date(daysKey[selectedId].day), 'dd')}`
        const index = days.findIndex((item) => item.date == today);
        console.log(index);
        if (days[index]) {

            dayDataByKey[daysKey[selectedId].key].forEach(lessonkey => {
                delete lessonsByIdData[lessonkey];
            });

            dayDataByKey[daysKey[selectedId].key] = [];
            days[index].lessons = days[index].lessons.filter(lesson => lesson.title != "Физическая культура");

            for (let i = 0; i < days[index].lessons.length; i++) {
                let group = JSON.parse(groupCopy);
                if (days[index].lessons[i].subgroup.title) {
                    if (days[index].lessons[i].subgroup.title.slice(-1) == 1) {
                        group = group.filter(student => student.flag == 1);
                    } else {
                        group = group.filter(student => student.flag == 2);
                    }
                }

                const warField = {
                    listId: [],
                    dataById: {}
                }

                group.forEach(element => {
                    warField.listId.push(element.key);
                    warField.dataById = {
                        ...warField.dataById,
                        [element.key]: {
                            name: element.name,
                            isHere: element.isHere,
                            desc: element.desc,
                            flag: element.flag
                        }
                    }
                });

                const lessonId = generateRandomString(15);
                dayDataByKey[daysKey[selectedId].key].push(lessonId);
                lessonsByIdData[lessonId] = {
                    title: days[index].lessons[i].title,
                    type: days[index].lessons[i].type,
                    timeStart: days[index].lessons[i].timeStart,
                    timeEnd: days[index].lessons[i].timeEnd,
                    students: warField,
                }
            }
        }
        else {
            // console.log("Сегодня выходной");
        }

        dispatch({
            type: "SET_DATA",
            keys: daysKey,
            dataByKeys: dayDataByKey,
            lessonsData: lessonsByIdData
        });

        await AsyncStorage.setItem('@daysKey', JSON.stringify(daysKey));
        await AsyncStorage.setItem('@dayDataByKey', JSON.stringify(dayDataByKey));
        await AsyncStorage.setItem('@lessonsByIdData', JSON.stringify(lessonsByIdData));


        const jsonCurrentDay = JSON.stringify(selectedId);
        await AsyncStorage.setItem('@lastDay', jsonCurrentDay);
        // console.log('я сохранил lastDay');
    };

    const updateSchedule = async (InUser, jsonGroup) => {
        const jsonWeek = await AsyncStorage.getItem('@lastWeek');
        // console.log('я прочитал lastWeek');
        if (!isEqual(new Date(JSON.parse(jsonWeek)[0]), date[0])) {
            // if (true) {
            await getUserWeek(InUser, jsonGroup);
            // console.log('я уже обновил всю неделю');
        } else {
            const jsonDay = await AsyncStorage.getItem('@lastDay');
            let lastDay = JSON.parse(jsonDay);
            // console.log(`lastDay: ${lastDay}; today: ${selectedId}`);
            if (lastDay != selectedId) {
                // if (true) {
                await getUserDay(InUser, jsonGroup);
                console.log('я обновил сегодняшний день');
            }
            else {
                // console.log('Я уже обновлял сегодняшний день');
                const jsonDaysKey = await AsyncStorage.getItem('@daysKey');
                const jsonDayDataByKey = await AsyncStorage.getItem('@dayDataByKey');
                const jsonLessonsByIdData = await AsyncStorage.getItem('@lessonsByIdData');
                dispatch({
                    type: "SET_DATA",
                    keys: JSON.parse(jsonDaysKey),
                    dataByKeys: JSON.parse(jsonDayDataByKey),
                    lessonsData: JSON.parse(jsonLessonsByIdData)
                });
                // console.log('Я прочитал сохранённое расписание');
            }
        }
    };

    useEffect(() => {
        async function prepare() {
            if (isEdited) {
                // console.log("пользователь ввёл новый логин");
                const jsonGroup = await AsyncStorage.getItem('@stu');
                await getUserWeek(userData, jsonGroup);
                dispatch({ type: "CANCLE_UPDATING", payload: true });
            };
        }
        prepare();
    }, [userData]);

    useEffect(() => {
        async function prepare() {
            try {
                const jsonUser = await AsyncStorage.getItem('userData');
                const jsonGroup = await AsyncStorage.getItem('@stu');
                const jsonSemesterStart = await AsyncStorage.getItem('@semesterSatrt');
                if (jsonGroup) {
                    const groupData = JSON.parse(jsonGroup);
                    dispatch({ type: "SET_STUDENTS", payload: groupData });
                }

                if (jsonSemesterStart) {
                    const date = JSON.parse(jsonSemesterStart)
                    dispatch({ type: "UPDATE_DATE", date: date });
                }

                if (jsonUser) {
                    const userData = JSON.parse(jsonUser);
                    dispatch({ type: "SET_USER", payload: userData });
                    await updateSchedule(userData, jsonGroup);
                }
                SplashScreen.hide();
            } catch (e) {
                console.warn(e);
            }
        }
        prepare();
    }, []);

    // const TabBarOptions = {
    //     activeTintColor: 'white',
    //     inactiveTintColor: 'black',
    //     indicatorStyle: { backgroundColor: 'red', height: '100%' },
    //     pressOpacity: 1,
    // };

    return (
        <Tab.Navigator
            screenOptions={{
                swipeEnabled: false,
                tabBarLabelStyle: {
                    fontFamily: "Inter-Regular"
                },
                tabBarStyle: { backgroundColor: 'white', }
                // tabBarActiveTintColor: 'black',
                // indicatorStyle: { backgroundColor: 'red', height: '100%' },
                // pressOpacity: 1,
            }}
        >
            <Tab.Screen
                name="Home"
                component={StackScreenA}
                options={({ navigation, route }) => ({
                    title: "Расписание",
                })}
            />
            <Tab.Screen
                name="Second"
                component={StackScreenB}
                options={({ navigation, route }) => ({
                    title: "учебная группа",
                })}
            />
        </Tab.Navigator>
    );
}
