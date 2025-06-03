import React, { useContext, useState, useEffect } from 'react';
import { Button, ActivityIndicator, Text, FlatList, View, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useSubscriptions } from '@/hooks/data';
import { useDeleteSubscription } from '@/hooks/reminder';
import * as Notifications from 'expo-notifications';

export default function AllReminders() {
    useEffect(() => {
    (async () => {
        const all = await Notifications.getAllScheduledNotificationsAsync();
        console.log('All scheduled notifications:', all);
    })();
  }, []);

    const router = useRouter();
    const deleteSubs = useDeleteSubscription();
    const [loaded, error] = useFonts({        
        Inter_500Medium,
    })  

    const {data: Subscriptions, loading} = useSubscriptions();

    if (!loaded && !error) {
        return null
    }

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    const renderItem = ({item}) => {
        const formattedDate = new Date(item.end_time).toLocaleDateString('en-GB');
        return (
            <View style={styles.row}>
                <Text style={{fontSize:18, color: 'red', width:"75%"}} onPress={() => router.push({
                        pathname: '/reminders/update',
                        params: { "id": item.id }    
                    })}>
                    {item.name} expired at {formattedDate}
                </Text>
                <Text 
                    style={{fontSize:18, color: 'red'}} 
                    onPress={async () =>   deleteSubs({id: item.id, noti_id: item.noti_id})}
                    
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
        <View style={styles.container}>
            
            <Text type="title"> All Subscriptions </Text>

            <FlatList
                data={Subscriptions}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
            
            <Button 
                title="add" 
                onPress={() => router.replace('/reminders/add')} 
                style = {styles.saveButton}
            />
            <Button 
                title="home" 
                onPress={() => router.replace('/tabs/home_page')} 
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
