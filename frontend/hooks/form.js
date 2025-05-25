import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useExpenseTypes, useCurrencyTypes, useUpdatingExpense } from "./data";

export function useExpenseForm(func, id = null) {
    // 1. form state
    const [category, setCategory] = useState("");
    const [amount, setAmount]     = useState("");
    const [currency, setCurrency] = useState("");
    const [day, setDay]           = useState("");
    const [month, setMonth]       = useState("");
    const [year, setYear]         = useState("");

    // 2. load data hooks
    const { data: expense_types, loading: load1 }   = useExpenseTypes();
    const { data: currency_types, loading: load2 }   = useCurrencyTypes();

    // 3. set defaults when loaded
    if(id == null){
        useEffect(() => {
            if (!load1 && !load2) {
                setCategory(expense_types[0]);
                setCurrency(currency_types[124]);
            }
        }, [load1, load2, expense_types, currency_types]);
    } else {
        const {data: expense, loading: load3} = useUpdatingExpense({id: id});
        useEffect(() => {
            if (!load3) {
                setCategory(expense.category);
                setAmount(parseFloat(expense.amount));
                setCurrency(expense.currency);
                const time = new Date(expense.time);
                setDay(time.getDate());
                setMonth(time.getMonth() + 1);
                setYear(time.getFullYear());
            }
        }, [load3, expense]);
    }
    // 4. validate + submit
    const submit = async () => {
        // all fields filled?
        if (![category, amount, currency, day, month, year].every(Boolean)) {
        return Alert.alert("Please fill out all fields");
        }

        // build date
        const dt = new Date(+year, +month - 1, +day);
        if (isNaN(dt.getTime())) {
        return Alert.alert("Invalid date");
        }

        // amount parse
        const amt = parseFloat(amount);
        if (isNaN(amt)) {
        return Alert.alert("Invalid amount");
        }

        await func({
            id,
            category,
            amount: amt,
            currency,
            time: dt.toISOString(),
        });
    };

    return {
        // state + setters
        category, setCategory,
        amount,   setAmount,
        currency, setCurrency,
        day,      setDay,
        month,    setMonth,
        year,     setYear,

        // data
        expense_types, currency_types,

        // loading flags
        load1, load2,

        // submit fn
        submit,
    };
}
