import React from "react";
import { View, Text, Image, Modal, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TouchableScale from "react-native-touchable-scale";
import { BlurView } from "expo-blur";
import { StatusBar } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import Axios from "axios";
import * as Animatable from "react-native-animatable";

export default class Front extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Modal
      modalVisible: false,

      //Modal
      isLoading: false,

      //String
      userEmail: "",
      apiMessage: "",
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 10000);
  }

  setForgot = () => {
    if (this.state.userEmail != "") {
      Axios.post(`https://app-ejurnal.herokuapp.com/reset`, {
        usergetEmail: this.state.userEmail,
      }).then((res) => {
        this.setState({
          apiMessage: `Pengaturan ulang kata sandi sudah di kirim ke email: ${res.data.data}`,
        });
      });
    } else {
      this.setState({
        apiMessage: "Email do not Empty!",
      });
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar hidden />

        <AnimatedLoader
          visible={this.state.isLoading}
          overlayColor="rgba(255,255,255,1)"
          source={require("../loading.json")}
          animationStyle={{ height: hp("25%"), width: wp("25%") }}
          speed={1}
        />

        <View
          style={{
            height: hp("75%"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              flex: 1,
              resizeMode: "contain",
            }}
            source={require("../portal.png")}
          />

          <Text
            style={{
              fontFamily: "ArchitectsDaughter-Regular",
              fontSize: hp("3%"),
            }}
          >
            Alter e-Jurnal
          </Text>
          <Text
            style={{
              fontFamily: "ArchitectsDaughter-Regular",
              fontSize: hp("1.5%"),
            }}
          >
            Mencari Jurnal Menjadi Lebih Mudah
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            onPress={() => this.props.navigation.navigate("LoginPage")}
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
            onPress={() => this.props.navigation.navigate("RegisterPage")}
          />
          <TouchableScale
            activeScale={0.7}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text
              style={{
                fontFamily: "ArchitectsDaughter-Regular",
                fontSize: hp("1.5%"),
                color: "#cc0000",
              }}
            >
              Lupa Password!
            </Text>
          </TouchableScale>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}
          >
            <BlurView
              intensity={300}
              style={[
                StyleSheet.absoluteFill,
                StyleSheet.nonBlurredContent,
                { justifyContent: "center" },
              ]}
            >
              <View
                style={{
                  marginVertical: hp("5%"),
                  marginHorizontal: wp("1.5%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: hp("2.5%"),
                    fontFamily: "ArchitectsDaughter-Regular",
                  }}
                >
                  Lupa Kata Sandi!
                </Text>

                <Input
                  placeholderTextColor="#ffb2ae"
                  placeholder="Email"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="email"
                      size={24}
                      color="#ff6961"
                    />
                  }
                  inputContainerStyle={{ borderBottomColor: "#ff6961" }}
                  inputStyle={{ color: "#cc0000" }}
                  returnKeyType="done"
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({ userEmail: text })}
                  value={this.state.userEmail}
                />

                <Text
                  style={{
                    margin: hp("1.5%"),
                    color: "#4d4dff",
                    textAlign: "center",
                    fontFamily: "ArchitectsDaughter-Regular",
                  }}
                >
                  {this.state.apiMessage}
                </Text>

                <Button
                  title="Kirim Email Pengaturan Ulang Kata Sandi"
                  buttonStyle={{
                    margin: 10,
                    backgroundColor: "#ff6961",
                    width: wp("70%"),
                  }}
                  titleStyle={{ fontFamily: "ArchitectsDaughter-Regular" }}
                  icon={
                    <MaterialCommunityIcons
                      name="send"
                      size={24}
                      color="white"
                    />
                  }
                  onPress={() => this.setForgot()}
                />

                <Button
                  title="Tutup"
                  buttonStyle={{
                    margin: 10,
                    backgroundColor: "#ff6961",
                    width: wp("70%"),
                  }}
                  titleStyle={{ fontFamily: "ArchitectsDaughter-Regular" }}
                  icon={
                    <MaterialCommunityIcons
                      name="login"
                      size={24}
                      color="white"
                    />
                  }
                  onPress={() =>
                    this.setState({
                      modalVisible: false,
                      apiMessage: "",
                      userEmail: "",
                    })
                  }
                />
              </View>
            </BlurView>
          </Modal>
        </View>
      </View>
    );
  }
}
