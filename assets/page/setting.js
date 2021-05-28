import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Animatable from "react-native-animatable";

export default class SettingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //String
      userNewPass: "",
      userConPass: "",
    };
  }

  _changePassword = () => {
    if (this.state.userNewPass.length < 6) {
      Alert.alert("Warning", "Kata Sandi Terlalu Sedikit");
    } else {
      if (this.state.userNewPass != this.state.userConPass) {
        Alert.alert("Warning", "Kata Sandi Tidak Sesuai, Silahkan Ulangi Lagi");
      } else {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(this.state.userNewPass)
          .then(function () {
            //Update successful.
            Alert.alert("Warning", "Kata Sandi Telah Terganti!");
          })
          .catch(function (error) {
            //An error happened.
            Alert.alert("Warning", error);
          });
      }
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <StatusBar hidden />

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
            source={require("../../assets/forgot.png")}
          />

          <Text
            style={{
              fontFamily: "ArchitectsDaughter-Regular",
              fontSize: hp("3%"),
            }}
          >
            Pengaturan Ulang Kata Sandi
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
            placeholder="Kata Sandi Baru"
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
            onChangeText={(text) => this.setState({ userNewPass: text })}
            value={this.state.userNewPass}
          />

          <Input
            placeholder="Konfirmasi Kata Sandi Baru"
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
            onChangeText={(text) => this.setState({ userConPass: text })}
            value={this.state.userConPass}
          />

          <Button
            title="Ganti Kata Sandi"
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
            onPress={() => this._changePassword()}
          />
        </Animatable.View>
      </View>
    );
  }
}
