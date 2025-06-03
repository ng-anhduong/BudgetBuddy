import React, { useContext } from 'react';
import { Button, ActivityIndicator, TextInput, View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useAddSubscription } from "@/hooks/reminder";
import { useSubscriptionForm } from "@/hooks/subsriptionForm";

export default function AddExpense() {  
    const add = useAddSubscription();
    const {
        name,      setName,
        sday,      setsDay,
        smonth,    setsMonth,
        syear,     setsYear,
        eday,      seteDay,
        emonth,    seteMonth,
        eyear,     seteYear,

        // submit fn
        submit: addSubs
    } = useSubscriptionForm(add);

    const router = useRouter();

    const [loaded, error] = useFonts({        
        Inter_500Medium,
    })
    
    if (!loaded && !error) {
        return null
    }


    // Screen
    return (
        <>

        <View style={styles.container}>
            <Text type="label">Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name..."
                value={name}
                maxLength={40}
                onChangeText={setName}
            />
            <Text type="label">Start date (DD / MM / YYYY)</Text>
            <View style={styles.dateRow}>
                <TextInput
                    style={[styles.input, styles.dateInput]}
                    placeholder="DD"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={sday}
                    onChangeText={setsDay}
                />
                <Text style={styles.dateSep}>/</Text>
                <TextInput
                    style={[styles.input, styles.dateInput]}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={smonth}
                    onChangeText={setsMonth}
                />
                <Text style={styles.dateSep}>/</Text>
                <TextInput
                    style={[styles.input, styles.dateYearInput]}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={syear}
                    onChangeText={setsYear}
                />
            </View>

            <Text type="label">End date (DD / MM / YYYY)</Text>
            <View style={styles.dateRow}>
                <TextInput
                    style={[styles.input, styles.dateInput]}
                    placeholder="DD"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={eday}
                    onChangeText={seteDay}
                />
                <Text style={styles.dateSep}>/</Text>
                <TextInput
                    style={[styles.input, styles.dateInput]}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={emonth}
                    onChangeText={seteMonth}
                />
                <Text style={styles.dateSep}>/</Text>
                <TextInput
                    style={[styles.input, styles.dateYearInput]}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={eyear}
                    onChangeText={seteYear}
                />
            </View>

            <Button 
                title="Save" 
                onPress={addSubs} 
                style = {styles.saveButton}
            />
            <Button 
                title="Back" 
                onPress={() => router.replace('/reminders/allReminders')} 
                style = {styles.saveButton}
            />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffde1a',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  details: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  pickerWrapper: {
        borderWidth: 1,

        borderRadius: 4,
        marginBottom: 12,
        overflow: "hidden",
  },
  picker: {
      height: 50,
      width: "100%",
  },
});
