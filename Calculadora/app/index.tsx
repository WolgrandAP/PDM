import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type Operator = '+' | '-' | 'X' | '/' | 'x^y' | null;

export default function CalculatorScreen() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operator, setOperator] = useState<Operator>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [nextValueExpected, setNextValueExpected] = useState<boolean>(false);

  const addDigit = (digit: string) => {
    if (digit === ',' && displayValue.includes(',') && !nextValueExpected) return;

    if (displayValue === '0' || nextValueExpected) {
      setDisplayValue(digit === ',' ? '0,' : digit);
      setNextValueExpected(false);
    } else {
      setDisplayValue(displayValue + digit);
    }
  };

  const clear = () => {
    setDisplayValue('0');
    setOperator(null);
    setPreviousValue(null);
    setNextValueExpected(false);
  };

  const handleOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(displayValue.replace(',', '.'));

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplayValue(String(result).replace('.', ','));
      setPreviousValue(result);
    }

    setNextValueExpected(true);
    setOperator(nextOperator);
  };

  const calculate = (val1: number, val2: number, op: Operator): number => {
    switch (op) {
      case '+': return val1 + val2;
      case '-': return val1 - val2;
      case 'X': return val1 * val2;
      case '/': return val1 / val2;
      case 'x^y': return Math.pow(val1, val2);
      default: return val2;
    }
  };

  const finalize = () => {
    if (!operator || previousValue === null) return;
    const inputValue = parseFloat(displayValue.replace(',', '.'));
    const result = calculate(previousValue, inputValue, operator);
    
    setDisplayValue(String(result).replace('.', ','));
    setPreviousValue(null);
    setOperator(null);
    setNextValueExpected(true);
  };

  interface ButtonProps {
    label: string;
    onPress: (label: string) => void;
  }

  const Button = ({ label, onPress }: ButtonProps) => (
    <TouchableOpacity style={styles.button} onPress={() => onPress(label)}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText} numberOfLines={1}>{displayValue}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button label="C" onPress={clear} />
        <Button label="x^y" onPress={() => handleOperation('x^y')} />
        <Button label="<" onPress={() => setDisplayValue(displayValue.length > 1 ? displayValue.slice(0, -1) : '0')} />
        <Button label="/" onPress={() => handleOperation('/')} />

        {['7', '8', '9', 'X', '4', '5', '6', '-', '1', '2', '3', '+'].map((item) => (
          <Button 
            key={item} 
            label={item} 
            onPress={(l) => (['X','/','+','-'].includes(l) ? handleOperation(l as Operator) : addDigit(l))} 
          />
        ))}

        <Button label="=" onPress={finalize} />
        <Button label="0" onPress={addDigit} />
        <Button label="," onPress={addDigit} />
        <Button label="=" onPress={finalize} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  display: {
    flex: 0.15,
    backgroundColor: '#808080',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  displayText: { fontSize: 48, color: '#FFF' },
  buttonsContainer: {
    flex: 0.7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: '21%',
    height: 75,
    backgroundColor: '#B0B0B0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    borderRadius: 20,
  },
  buttonText: { fontSize: 22, fontWeight: '600' },
});