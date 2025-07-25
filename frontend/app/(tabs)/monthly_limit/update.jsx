import React, { useState, useEffect } from 'react';
import { Platform, Button, ActivityIndicator, TextInput, View, Text, Alert, TouchableOpacity, ScrollView, StyleSheet, } from 'react-native';
import { useRouter, useLocalSearchParams  } from 'expo-router';
import DropDownPicker from "react-native-dropdown-picker";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useUpdateLimit } from "@/hooks/crud";
import { useMonthlyLimitForm } from "@/hooks/monthlyLimitForm";
import { MaterialIcons } from '@expo/vector-icons';

export default function AddLimit() {  
    const { id } = useLocalSearchParams(); 
    const update = useUpdateLimit();
    const {
        types,      setTypes,
        amount,     setAmount,
        currency,   setCurrency,
        expense_types, currency_types,
        load1, load2,
        submit: updateLimit,
    } = useMonthlyLimitForm(update, id);

    const router = useRouter();
    const [loaded, error] = useFonts({        
        Inter_500Medium,
    })
    
      /* ────────── local state for the field ────────── */
    const [openCurrency, setOpenCurrency] = useState(false);
    
    if (!loaded && !error) {
        return null
    }

    if (load1 || load2) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

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

    const pastel = ['#D0E8F2','#FADADD','#C1F0DC','#FFFACD','#EADCF2','#FFEDCC'];

    return (
    <ScrollView contentContainerStyle={[styles.card, { paddingTop: 70 }]}>
        <Text style={styles.heading}>Update Budget Limit</Text>

        {/* ── Category chips  (single-select) ───────────────────── */}
        <Text style={styles.label}>Select a Category</Text>
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
        >
        {expense_types.map((type, i) => {
            const active = types[0] === type;               // single choice
            const bg     = active ? pastel[i % pastel.length] : '#eee';
            return (
            <TouchableOpacity
                key={type}
                onPress={() => setTypes([type])}            // single choice setter
                style={[styles.pill, { backgroundColor: bg }]}
            >
                <Text>{type}</Text>
            </TouchableOpacity>
            );
        })}
        </ScrollView>

        {/* ── Amount ─────────────────────────────────────────── */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        />

        {/* ── Currency  ───────────────────────────────────────── */}
        <Text style={styles.label}>Currency</Text>
        <DropDownPicker
          open={openCurrency}
          value={currency}

          items={currency_types.map((c) => ({ label: c, value: c }))}
          setOpen={setOpenCurrency}
          setValue={setCurrency}    

          /* ---- fixed light palette ---- */
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          listItemLabelStyle={styles.dropdownText}

          placeholder="Select"
          searchable
          zIndex={10}        /* avoids overlap inside ScrollViews / modals */
        />


        {/* ── Buttons ────────────────────────────────────────── */}
        <TouchableOpacity onPress={updateLimit} style={styles.saveBtn}>
        <Text style={styles.btnTxt}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={() => router.replace('/(tabs)/monthly_limit/allLimits')}
        style={styles.cancelBtn}
        >
        <Text style={[styles.btnTxt, { color: '#000' }]}>Back</Text>
        </TouchableOpacity>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
  },


  // ── Buttons ─────────────────────────────────────────────────────────────────────
  addButton: {
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#fff',
  },
  backButton: {
    marginBottom: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#000',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  typeItem: {
    width: '50%',          // two per row
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#4CAF50',
  },

  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },

  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 20,
  },

  // ── Dropdown Styles ───────────────────────────────────────────────────────────
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownText: {
    color: '#000',
  },

  /* buttons */
  saveBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});