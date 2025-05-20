import React, { useState, useContext, useCallback } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import createStyles from "./style";
import { useRouter } from 'expo-router';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { useSignUp } from "@/hooks/auth";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);
  const [loaded, error] = useFonts({
        Inter_500Medium,
  });

  const signUp = useSignUp();

  if (!loaded && !error) {
        return null
  }
  
  const styles = createStyles(theme, colorScheme);

  const validatePasswordRules = (password) => ({
    minLength: password.length >= 6,
    maxLength: password.length <= 100,
    hasNumber: /\d/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const renderRule = (label, passed) => (
    <Text style={{ color: passed ? "green" : "red" }}>{passed ? "✔" : "✖"} {label}</Text>
  );

  const passwordRules = validatePasswordRules(password);

  return (
    <SafeAreaView style ={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputContainer}
        />
        <View style={{ marginBottom: 10 }}>
          {renderRule("At least 6 characters", passwordRules.minLength)}
          {renderRule("No more than 100 characters", passwordRules.maxLength)}
          {renderRule("Contains a number", passwordRules.hasNumber)}
          {renderRule("Contains a lowercase letter", passwordRules.hasLowercase)}
          {renderRule("Contains an uppercase letter", passwordRules.hasUppercase)}
          {renderRule("Contains a special character", passwordRules.hasSpecialChar)}
      </View>
        <Button 
          title="Sign Up" 
          onPress={() => signUp(username, password)} 
          style = {styles.saveButton}
        />
        <Button 
          title="Sign In" 
          onPress={()=>router.push('/auth/sign_in')} 
          style = {styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}