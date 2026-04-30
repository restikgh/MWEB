import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function FormulirListScreen() {
  return (
    <View>
      <Text>Halaman List Formulir</Text>
    </View>
  );
}

function FormulirDetailScreen() {
  return (
    <View>
      <Text>Halaman Detail Formulir</Text>
    </View>
  );
}

function FormulirFormScreen() {
  return (
    <View>
      <Text>Halaman Form Formulir</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={FormulirListScreen} />
        <Stack.Screen name="Detail" component={FormulirDetailScreen} />
        <Stack.Screen name="Form" component={FormulirFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}