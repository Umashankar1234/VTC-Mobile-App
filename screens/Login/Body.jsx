import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React from "react";
import { HelperText, TextInput } from "react-native-paper";
import { emailOnly } from "../Methods/ValidateForms";

const Body = ({
  userData,
  setUserData,
  errors,
  setErrors,
  toggleSecureEntry,
  secureTextEntry,
}) => {
  return (
    <>
      <View style={styles.stepContainer}>
          <View style={styles.formCtrlWrap}>
            <TextInput
              mode="outlined"
              error={errors.username != ""}
              outlineStyle={styles.formControlOutdoor}
              style={styles.formControl}
              label="Username"
              value={userData.username}
              name="email"
              right={<TextInput.Icon icon="account" />}
              onChangeText={(value) => {
                setUserData({ ...userData, username: value });
                emailOnly(value, setErrors, errors, "username");
              }}
            />
            <HelperText type="error" visible={errors.username != ""}>
              {errors.username}
            </HelperText>
          </View>
          <View style={styles.formCtrlWrap}>
            <TextInput
              mode="outlined"
              error={errors.password != ""}
              outlineStyle={styles.formControlOutdoor}
              style={styles.formControl}
              label="Password"
              value={userData.password}
              name="password"
              secureTextEntry={secureTextEntry}
              right={
                <TextInput.Icon
                  onPress={toggleSecureEntry}
                  icon={secureTextEntry ? "eye-off" : "eye"}
                />
              }
              onChangeText={(value) => {
                setUserData({ ...userData, password: value });
                if (value.length == 0)
                  setErrors({ ...errors, password: "Required" });
                else setErrors({ ...errors, password: "" });
              }}
            />

            <HelperText type="error" visible={errors.password != ""}>
              {errors.password}
            </HelperText>
          </View>
      </View>
    </>
  );
};

export default Body;

const styles = StyleSheet.create({
  stepContainer: { flex: 1, marginBottom: 10 },
  formCtrlWrap: { paddingHorizontal: 20 },
  formControl: {},
  formControlOutdoor: {},
});
