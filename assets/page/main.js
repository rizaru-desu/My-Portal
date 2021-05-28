import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { BackHandler, View, Alert, LogBox } from "react-native";
import Axios from "axios";
import * as firebase from "firebase";
import { AdMobInterstitial, AdMobBanner } from "expo-ads-admob";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //String
      displayEmail: "",

      canGoBack: false,
    };

    this.interstitialAdId =
      Platform.OS === "ios" ? null : "ca-app-pub-9341343436751788/8285123822";
    this.bannerAdId =
      Platform.OS === "ios" ? null : "ca-app-pub-9341343436751788/4893491966";
    LogBox.ignoreAllLogs(true);
  }
  WEBVIEW_REF = React.createRef();

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

    try {
      this.setState({ isLoading: true });
      this.interval = setTimeout(() => {
        let user = firebase.auth().currentUser;
        if (user != null) {
          this.setState({ displayEmail: user.email });
          if (user.emailVerified) {
            this.setState({ isLoading: false });
          } else {
            this.setState({ isLoading: false });
            Alert.alert(
              "Verifikasi Email Kamu",
              "Verifikasi Akan Dikirim ke Email: " + user.email + "?",
              [
                {
                  text: "Log Out",
                  onPress: () =>
                    firebase
                      .auth()
                      .signOut()
                      .then(function () {})
                      .catch(function (error) {
                        console.log(error);
                      }),
                  style: "cancel",
                },
                { text: "Send", onPress: () => this._senVerified() },
              ],
              { cancelable: false }
            );
          }
        }
      }, 5000);

      //ADMOB
      AdMobInterstitial.setAdUnitID(this.interstitialAdId);
      await AdMobInterstitial.requestAdAsync({
        servePersonalizedAds: false,
      });
      await AdMobInterstitial.showAdAsync();
    } catch (error) {
      console.log(error);
    }
  }

  _senVerified = () => {
    Axios.post(`https://app-ejurnal.herokuapp.com/verified`, {
      usergetEmail: this.state.displayEmail,
    })
      .then((res) => {
        Alert.alert(
          null,
          `Check your Email: ${res.data.data}`,
          [
            {
              text: "OK",
              onPress: () =>
                firebase
                  .auth()
                  .signOut()
                  .then(function () {})
                  .catch(function (error) {
                    console.log(error);
                  }),
            },
          ],
          { cancelable: false }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async componentWillUnmount() {
    clearTimeout(this.interval);
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.canGoBack) {
      this.WEBVIEW_REF.current.goBack();
      return true;
    }
  };

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  };

  render() {
    const jsCode = `document.querySelectorAll('.ui.stackable.menu.top-menu').forEach(e => e.remove());document.querySelectorAll('.links-box').forEach(e => e.remove());document.querySelectorAll('.ui.grid.equal.width.footer').forEach(e => e.remove());document.querySelectorAll('.ui.equal.width.grid').forEach(e => e.remove());`;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <WebView
          source={{
            uri: "https://garuda.ristekbrin.go.id/",
          }}
          originWhitelist={["*"]}
          javaScriptEnabledAndroid={true}
          style={{ marginTop: 20 }}
          bounces={false}
          scrollEnabled={true}
          injectedJavaScript={jsCode}
          ref={this.WEBVIEW_REF}
          onNavigationStateChange={this.onNavigationStateChange}
          onMessage={this.onMessage}
        />

        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={this.bannerAdId} // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds // true or false
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </View>
    );
  }
}
