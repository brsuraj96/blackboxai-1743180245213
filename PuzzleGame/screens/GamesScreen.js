import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const games = [
  { id: "1", name: "Sudoku" },
  { id: "2", name: "Crossword" },
  { id: "3", name: "Jigsaw Puzzle" },
  { id: "4", name: "Matchstick Puzzle" },
  { id: "5", name: "Spot the Difference" },
  { id: "6", name: "Flow Free" },
  { id: "7", name: "Water Flow Puzzle" },
  { id: "8", name: "Trivia" },
  { id: "9", name: "Riddles" },
  { id: "10", name: "Slide Tile" },
];

const GamesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Game!</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gameButton}
            onPress={() => navigation.navigate(item.name)} // Navigate to the corresponding screen
          >
            <Text style={styles.gameText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  gameButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  gameText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default GamesScreen;
