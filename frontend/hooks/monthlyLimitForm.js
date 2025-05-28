import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useExpenseTypes, useCurrencyTypes, useUpdatingLimit } from "./data";

export function useMonthlyLimitForm(func, id = null) {
    // 1. form state
    const [types, setTypes]                 = useState([]);
    const [amount, setAmount]               = useState("");
    const [currency, setCurrency]           = useState("");

    // 2. load data hooks
    const { data: expense_types,  loading: load1 }   = useExpenseTypes();
    const { data: currency_types, loading: load2 }   = useCurrencyTypes();

    // 3. set defaults when loaded
    if(id == null){
        useEffect(() => {
            if (!load1 && !load2) {
                setCurrency((currency_types[124]).toString());
            }
        }, [load1, load2, expense_types, currency_types]);
    } else {
        const {data: lim, loading: load3} = useUpdatingLimit({id: id});
        useEffect(() => {
            if (!load3) {
                setAmount((parseFloat(lim.amount)).toString());
                setCurrency((lim.currency).toString());
                setTypes(lim.types)
            }
        }, [load3, lim]);
    }
    // 4. validate + submit
    const submit = async () => {
        // all required fields filled?
        if (![amount, currency].every(Boolean) || types.length == 0) {
        return Alert.alert("Please fill out all compulsory fields");
        }

        // amount parse
        const amt = parseFloat(amount);
        if (isNaN(amt)) {
            return Alert.alert("Invalid amount");
        }
       
        console.log(amt)
        console.log(currency)
        console.log(types)
        await func({
            id,
            amount: amt,
            currency,
            types: types,
        });
    };

    return {
        // state + setters
        types,      setTypes,
        amount,     setAmount,
        currency,   setCurrency,

        // data
        expense_types, currency_types,

        // loading flags
        load1, load2,

        // submit fn
        submit,
    };
}
