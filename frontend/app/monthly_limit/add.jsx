import React, { useContext, useEffect } from 'react';
import { Button, ActivityIndicator, TextInput, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from "@react-native-picker/picker";
import createStyles from "./style";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { useAddLimit } from "@/hooks/crud";
import { useMonthlyLimitForm } from "@/hooks/monthlyLimitForm";
import { MaterialIcons } from '@expo/vector-icons';

export default function AddLimit() {  
    
    const add = useAddLimit();
    const {
        types,      setTypes,
        amount,     setAmount,
        currency,   setCurrency,
        expense_types, currency_types,
        load1, load2,
        submit: addLimit,
    } = useMonthlyLimitForm(add);
    // useEffect(()=>{
    //     console.log(types) check for tick boxes
    // }, [types])
    const router = useRouter();
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const [loaded, error] = useFonts({        
        Inter_500Medium,
    })
    
    if (!loaded && !error) {
        return null
    }

    if (load1 || load2) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    const styles = createStyles(theme, colorScheme);

    const toggleType = (opt) => {
        setTypes((prev) =>
            prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
        );
    }

    const toggleAll = () => {
        const allSelected = types.length === expense_types.length;
        setTypes(allSelected ? [] : [...expense_types]);
    };
    
    function CustomCheckbox({ checked, onChange }) {
        return (
            <TouchableOpacity onPress={() => onChange(!checked)} style={{padding: 4,}}>
            <MaterialIcons
                name={checked ? 'check-box' : 'check-box-outline-blank'}
                size={24}
            />
            </TouchableOpacity>
        );
    }
    // Screen
    return (
        <>
        <ThemedView style={styles.container}>
            <ThemedText type="label">Choose Group of types (at least 1 element)</ThemedText>
            <ScrollView
                style={{ maxHeight: 200 }}
                contentContainerStyle={styles.wrapContainer}
            >
                {/* Select All checkbox */}
                <TouchableOpacity
                key="__select_all__"
                style={styles.typeItem}
                onPress={toggleAll}
                >
                <CustomCheckbox
                    checked={types.length === expense_types.length}
                    onChange={toggleAll}
                />
                <Text style={styles.label}>Select All</Text>
                </TouchableOpacity>
                {expense_types.map(type => (
                    <TouchableOpacity key={type} style={styles.typeItem} onPress={() => toggleType(type)}>
                    <CustomCheckbox checked={types.includes(type)} onChange={() => toggleType(type)} />
                    <Text style={styles.label}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ThemedText type="label">Amount</ThemedText>
            <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                keyboardType="decimal-pad"
                onChangeText={setAmount}
            />

            <ThemedText type="label">Currency</ThemedText>
            <View style={styles.pickerWrapper}>
                <Picker
                    enable={!load2}
                    selectedValue={currency}
                    onValueChange={setCurrency}
                    style={styles.picker}
                >
                {load2
                    ? <Picker.Item label="Loading…" value="" />
                    : currency_types.map(t => <Picker.Item key={t} label={t} value={t} />)
                }
                </Picker>
            </View>

            <Button 
                title="Save" 
                onPress={addLimit} 
                style = {styles.saveButton}
            />
            <Button 
                title="Back" 
                onPress={() => router.replace('/monthly_limit/allLimits')} 
                style = {styles.saveButton}
            />
        </ThemedView>
        </>
    );
}

