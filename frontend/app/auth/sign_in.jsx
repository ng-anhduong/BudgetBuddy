import React, { useState, useContext } from "react";
import { View, TextInput, Button} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import createStyles from "./style";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { useSignIn } from "@/hooks/auth";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const [loaded, error] = useFonts({
        Inter_500Medium,
  })
  const signIn = useSignIn();

  if (!loaded && !error) {
        return null
  }

  const styles = createStyles(theme, colorScheme)

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
        <Button 
          title="Sign In" 
          onPress={() => signIn(username, password)} 
          style = {styles.saveButton}
        />
        <Button 
          title="Sign up" 
          onPress={() => router.push('/auth/sign_up')} 
          style = {styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}