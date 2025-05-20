import React, { useContext } from 'react';
import { Button, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import createStyles from "./style";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { useSignOut } from "@/hooks/auth";
import { useUsername } from "@/hooks/data";

export default function NotFoundScreen() {
    const router = useRouter();
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const [loaded, error] = useFonts({        
        Inter_500Medium,
    })  
    const {data: username, loading} = useUsername();
    const signOut = useSignOut();
    
    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme);

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    if (!username) {
        return <Text style={{ padding: 20 }}>No data</Text>;
    }
    
    // Screen
    return (
        <>
        <ThemedView style={styles.container}>
            <ThemedText type="title">Coming soon.</ThemedText>
            <ThemedText type="title"></ThemedText>
            <ThemedText type="title">Welcome, {username} </ThemedText>
            <ThemedText type="title"></ThemedText>

            <Button 
                title="Sign out" 
                onPress={() => signOut()} 
                style = {styles.saveButton}
            />
        </ThemedView>
        </>
    );
}

