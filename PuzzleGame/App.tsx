import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "./screens/HomeScreen";
import GamesScreen from "./screens/GamesScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SudokuScreen from "./screens/SudokuScreen";
import CrosswordScreen from "./screens/CrosswordScreen";
import JigsawScreen from "./screens/JigsawScreen";
import MatchstickScreen from "./screens/MatchstickScreen";
import SpotDifferenceScreen from "./screens/SpotDifferenceScreen";
import FlowFreeScreen from "./screens/FlowFreeScreen";
import WaterFlowScreen from "./screens/WaterFlowScreen";
import TriviaScreen from "./screens/TriviaScreen";
import RiddlesScreen from "./screens/RiddlesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GamesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Games" component={GamesScreen} />
      <Stack.Screen name="Sudoku" component={SudokuScreen} />
      <Stack.Screen name="Crossword" component={CrosswordScreen} />
      <Stack.Screen name="Jigsaw" component={JigsawScreen} />
      <Stack.Screen name="Matchstick" component={MatchstickScreen} />
      <Stack.Screen
        name="Spot the Difference"
        component={SpotDifferenceScreen}
      />
      <Stack.Screen name="Flow Free" component={FlowFreeScreen} />
      <Stack.Screen name="Water Flow" component={WaterFlowScreen} />
      <Stack.Screen name="Trivia" component={TriviaScreen} />
      <Stack.Screen name="Riddles" component={RiddlesScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = (() => {
              switch (route.name) {
                case "Home":
                  return "home";
                case "Games":
                  return "gamepad-variant";
                case "Leaderboard":
                  return "trophy";
                case "Profile":
                  return "account";
                default:
                  return "help-circle";
              }
            })();

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Games"
          component={GamesStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
