import React from "react";
import { View, Text, Image } from "react-native";
import { Button, Input } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TouchableScale from "react-native-touchable-scale";

import * as firebase from "firebase";
import { StatusBar } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from "react-native-animatable";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Modal
      isLoading: false,

      //String
      userEmail: "",
      userPassword: "",
    };
  }

  getLogin = () => {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar hidden />

        <AnimatedLoader
          visible={this.state.isLoading}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("../loading.json")}
          animationStyle={{ height: hp("25%"), width: wp("25%") }}
          speed={1}
        />

        <Animatable.View
          animation="bounceIn"
          iterationCount={1}
          duration={5000}
          direction="alternate"
          style={{
            height: hp("50%"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              flex: 1,
              resizeMode: "contain",
            }}
            source={require("../login.png")}
          />

          <Text
            style={{
              fontFamily: "ArchitectsDaughter-Regular",
              fontSize: hp("3%"),
            }}
          >
            Masuk
          </Text>
          <Text
            style={{
              fontFamily: "ArchitectsDaughter-Regular",
              fontSize: hp("1.5%"),
            }}
          >
            Untuk Mendapatkan Akses E-Jurnal
          </Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUpBig"
          iterationCount={1}
          duration={5000}
          direction="alternate"
          style={{
            flex: 1,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Input
            placeholderTextColor="#ffb2ae"
            placeholder="Email"
            leftIcon={
              <MaterialCommunityIcons name="email" size={24} color="#ff6961" />
            }
            inputContainerStyle={{ borderBottomColor: "#ff6961" }}
            inputStyle={{
              color: "#cc0000",
              fontFamily: "ArchitectsDaughter-Regular",
            }}
            returnKeyType="done"
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ userEmail: text })}
            value={this.state.userEmail}
          />

          <Input
            placeholder="Kata Sandi"
            placeholderTextColor="#ffb2ae"
            leftIcon={
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#ff6961"
              />
            }
            secureTextEntry={true}
            inputContainerStyle={{ borderBottomColor: "#ff6961" }}
            inputStyle={{
              color: "#cc0000",
              fontFamily: "ArchitectsDaughter-Regular",
            }}
            returnKeyType="done"
            keyboardType="default"
            onChangeText={(text) => this.setState({ userPassword: text })}
            value={this.state.userPassword}
          />

          <Button
            title="Masuk"
            type="solid"
            buttonStyle={{
              margin: 10,
              backgroundColor: "#ff6961",
              width: wp("70%"),
            }}
            titleStyle={{ fontFamily: "ArchitectsDaughter-Regular" }}
            icon={
              <MaterialCommunityIcons name="login" size={24} color="white" />
            }
            onPress={() => this.getLogin()}
          />

          <TouchableScale
            activeScale={0.7}
            onPress={() => this.props.navigation.navigate("RegisterPage")}
          >
            <Text
              style={{
                fontFamily: "ArchitectsDaughter-Regular",
                fontSize: hp("1.5%"),
                color: "#cc0000",
              }}
            >
              Jika Belum Memiliki Akun, Klik Disini!
            </Text>
          </TouchableScale>
        </Animatable.View>
      </View>
    );
  }
}
