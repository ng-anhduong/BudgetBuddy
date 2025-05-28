import React, { useContext, useState, useEffect } from 'react';
import { Button, ActivityIndicator, Text, FlatList, View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from "@react-native-picker/picker";
import createStyles from "./style";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { useMonthlyLimits, useCurrencyTypes } from "@/hooks/data";
import { useDeleteLimit } from '@/hooks/crud';

export default function AllLimits() {
    const { cur } = useLocalSearchParams();  
    const router = useRouter();
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const [loaded, error] = useFonts({        
        Inter_500Medium,
    })  
    const {data: Limits, loading: load1} = useMonthlyLimits({currency: cur});
    const deleteLimit = useDeleteLimit();
    const {data: currency_types, loading: load2} = useCurrencyTypes();
    const [currency, setCurrency] = useState("");
    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme);

    if (load1) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }
    
    const renderItem = ({item}) => {
        return (
            <View style={styles.row}>
                <Text style={{fontSize:18, color: 'red', width:"75%"}}
                    onPress={()=>router.push({
                        pathname:'/monthly_limit/update',
                        params: {"id": item.id}
                    })}
                >
                    {item.types.length == 12 ? "All": item.types.map(x=> x + " ")} {item.percentage}% : {item.total} / {item.amount} {item.currency}
                </Text>
                <Text 
                    style={{fontSize:18, color: 'red'}} 
                    onPress={() => deleteLimit({id: item.id})}
                >
                    Delete
                </Text>
            </View>

        );
    }

    const keyExtractor = (item, index) => index.toString();

    // Screen
    return (
        <>
        <ThemedView style={styles.container}>
            
            <ThemedText type="title"> All Monthly Limit </ThemedText>
            <View style={styles.pickerWrapper}>
                <Picker
                    enabled={!load2}
                    selectedValue={currency}
                    onValueChange={setCurrency}
                    style={styles.picker}
                >
                <Picker.Item
                    label="Original"
                    value={null}
                    color="#999"
                />
                {load2
                    ? <Picker.Item label="Loading…" value="" />
                    : currency_types.map(t => <Picker.Item key={t} label={t} value={t} />)
                }
                </Picker>

                <Button 
                    title="Change currency" 
                    onPress={() => currency == "" 
                        ? router.replace('/monthly_limit/allLimits')
                        : router.replace({
                            pathname:'/monthly_limit/allLimits',
                            params: {"cur": currency}
                        })
                    }
                    style = {styles.saveButton}
                />
            </View>

            <FlatList
                data={Limits}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
            
            <Button 
                title="add" 
                onPress={() => router.replace('/monthly_limit/add')} 
                style = {styles.saveButton}
            />
            <Button 
                title="home" 
                onPress={() => router.replace('/tabs/home_page')} 
                style = {styles.saveButton}
            />
        </ThemedView>
        </>
    );
}

