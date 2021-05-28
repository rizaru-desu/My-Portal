import React from "react";
import { View, Text, Image, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TouchableScale from "react-native-touchable-scale";
import Axios from "axios";
import { StatusBar } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from "react-native-animatable";

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Modal
      isLoading: false,

      //String
      userEmail: "",
      userPassword: "",
      userDisplay: "",
    };
  }

  _registerUser = () => {
    if (this.state.userPassword.length < 6) {
      Alert.alert("Warning", "Kata Sandi Terlalu Sedikit");
    } else {
      if (this.state.userEmail != "") {
        if (this.state.userDisplay != "") {
          this.setState({ isLoading: true });
          Axios.post("https://app-ejurnal.herokuapp.com/API-Create", {
            email: this.state.userEmail,
            password: this.state.userPassword,
            displayName: this.state.userDisplay,
          })
            .then((res) => {
              this.setState({
                isLoading: false,
                userEmail: "",
                userPassword: "",
                userDisplay: "",
              });
              Alert.alert(res.data.message);
            })
            .catch((err) => {
              this.setState({ isLoading: false });
              Alert.alert(err);
            });
        } else {
          Alert.alert("Warning", "Masukan Nama Lengkap");
        }
      } else {
        Alert.alert("Warning", "Masukan Email yang Terdaftar");
      }
    }
  };

  _backLogin = () => {
    this.setState({
      userEmail: "",
      userPassword: "",
      userDisplay: "",
    });
    this.props.navigation.navigate("LoginPage");
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
            height: hp("45%"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              flex: 1,
              resizeMode: "contain",
            }}
            source={require("../register.png")}
          />

          <Text
            style={{
              fontFamily: "ArchitectsDaughter-Regular",
              fontSize: hp("3%"),
            }}
          >
            Register
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
            placeholderTextColor="#ffdb9b"
            placeholder="Nama Lengkap"
            leftIcon={
              <MaterialCommunityIcons
                name="card-account-details"
                size={24}
                color="#ffc04d"
              />
            }
            inputContainerStyle={{ borderBottomColor: "#ffc04d" }}
            inputStyle={{
              color: "#ffc04e",
              fontFamily: "ArchitectsDaughter-Regular",
            }}
            returnKeyType="done"
            keyboardType="default"
            onChangeText={(text) => this.setState({ userDisplay: text })}
            value={this.state.userDisplay}
          />

          <Input
            placeholderTextColor="#ffdb9b"
            placeholder="Email"
            leftIcon={
              <MaterialCommunityIcons name="email" size={24} color="#ffc04d" />
            }
            inputContainerStyle={{ borderBottomColor: "#ffc04d" }}
            inputStyle={{
              color: "#ffc04e",
              fontFamily: "ArchitectsDaughter-Regular",
            }}
            returnKeyType="done"
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ userEmail: text })}
            value={this.state.userEmail}
          />

          <Input
            placeholder="Kata Sandi"
            placeholderTextColor="#ffdb9b"
            leftIcon={
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#ffc04d"
              />
            }
            secureTextEntry={true}
            inputContainerStyle={{ borderBottomColor: "#ffc04d" }}
            inputStyle={{
              color: "#ffc04e",
              fontFamily: "ArchitectsDaughter-Regular",
            }}
            returnKeyType="done"
            keyboardType="default"
            onChangeText={(text) => this.setState({ userPassword: text })}
            value={this.state.userPassword}
          />

          <Button
            title="Register"
            buttonStyle={{
              margin: 10,
              backgroundColor: "#ffc04d",
              width: wp("70%"),
            }}
            titleStyle={{ fontFamily: "ArchitectsDaughter-Regular" }}
            icon={
              <MaterialCommunityIcons
                name="account-plus"
                size={24}
                color="white"
              />
            }
            onPress={() => this._registerUser()}
          />

          <TouchableScale activeScale={0.7} onPress={() => this._backLogin()}>
            <Text
              style={{
                fontFamily: "ArchitectsDaughter-Regular",
                fontSize: hp("1.5%"),
                color: "#ffbf4f",
              }}
            >
              Jika Sudah Memiliki Akun, Klik Disini!
            </Text>
          </TouchableScale>
        </Animatable.View>
      </View>
    );
  }
}
