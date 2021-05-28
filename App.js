import React, { useState, useEffect } from "react";
import { InteractionManager, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { Button } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Firebase
import * as firebase from "firebase";
import { firebaseConfig } from "./assets/Api/ApiFirebase";

import Front from "./assets/page/front";
import LoginPage from "./assets/page/login";
import RegisterPage from "./assets/page/register";
import MainPage from "./assets/page/main";
import SettingPage from "./assets/page/setting";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

//SETTING A TIMER FOR A LONG PERIOD OF TIME
const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === "android") {
  // Work around issue `Setting a timer for long time`
  // see: https://github.com/firebase/firebase-js-sdk/issues/97
  const timerFix = {};
  const runTask = (id, fn, ttl, args) => {
    const waitingTime = ttl - Date.now();
    if (waitingTime <= 1) {
      InteractionManager.runAfterInteractions(() => {
        if (!timerFix[id]) {
          return;
        }
        delete timerFix[id];
        fn(...args);
      });
      return;
    }

    const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
    timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
  };

  global.setTimeout = (fn, time, ...args) => {
    if (MAX_TIMER_DURATION_MS < time) {
      const ttl = Date.now() + time;
      const id = "_lt_" + Object.keys(timerFix).length;
      runTask(id, fn, ttl, args);
      return id;
    }
    return _setTimeout(fn, time, ...args);
  };

  global.clearTimeout = (id) => {
    if (typeof id === "string" && id.startWith("_lt_")) {
      _clearTimeout(timerFix[id]);
      delete timerFix[id];
      return;
    }
    _clearTimeout(id);
  };
}

function App() {
  const [isSignedIn, setisSignedIn] = useState(false);
  const [isNickname, setisisNickname] = useState(false);

  let [fontsLoaded] = useFonts({
    "ArchitectsDaughter-Regular": require("./assets/font/ArchitectsDaughter-Regular.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setisSignedIn(true);
          setisisNickname(user.displayName);
        } else {
          setisSignedIn(false);
        }
      });
    }, 5000);
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen
                name="MainPage"
                component={MainPage}
                options={({ navigation }) => ({
                  headerShown: true,
                  gestureEnabled: false,
                  headerTitle: isNickname,
                  headerTitleStyle: {
                    fontFamily: "ArchitectsDaughter-Regular",
                  },
                  headerRight: () => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        type="clear"
                        icon={
                          <MaterialCommunityIcons
                            name="account-settings"
                            size={24}
                            color="#ff6961"
                          />
                        }
                        onPress={() => navigation.navigate("SettingPage")}
                      />
                      <Button
                        type="clear"
                        icon={
                          <MaterialCommunityIcons
                            name="logout"
                            size={24}
                            color="#ff6961"
                          />
                        }
                        onPress={() =>
                          firebase
                            .auth()
                            .signOut()
                            .then(function () {})
                            .catch(function (error) {
                              console.log(error);
                            })
                        }
                      />
                    </View>
                  ),
                })}
              />
              <Stack.Screen
                name="SettingPage"
                component={SettingPage}
                options={{
                  headerShown: true,
                  gestureEnabled: false,
                  title: "Pengaturan",
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={Front}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="LoginPage"
                component={LoginPage}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="RegisterPage"
                component={RegisterPage}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
