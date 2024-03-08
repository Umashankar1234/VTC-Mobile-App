import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { SplashScreen } from "./screens/splash.component";
import { AuthProvider } from "./screens/context/AuthProvider";
import { default as theme } from "./theme.json";
import Toast from "react-native-toast-message";
import Routes from "./Routes";
import "react-native-gesture-handler";

// wrap whole app with <GestureHandlerRootView>
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000); // milliseconds
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          {showSplash ? <SplashScreen /> : <Routes />}
        </ApplicationProvider>
      </AuthProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  likeButton: {
    marginVertical: 16,
  },
});
