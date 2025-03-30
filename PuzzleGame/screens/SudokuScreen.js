import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Picker,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import sudoku from "sudoku";

const SudokuGame = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintCount, setHintCount] = useState(3); // Increased hints to 3
  const [history, setHistory] = useState([]);
  const [userEntries, setUserEntries] = useState(new Set());
  const [difficulty, setDifficulty] = useState("easy");
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // State for mute control
  const [showSettings, setShowSettings] = useState(false); // Settings toggle

  useEffect(() => {
    generateNewPuzzle();
    setTime(0);
  }, [difficulty]);

  useEffect(() => {
    const interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const generateNewPuzzle = () => {
    const difficultyLevels = { easy: 40, medium: 50, hard: 60 };
    const newPuzzle = sudoku.makepuzzle();
    const newSolution = sudoku.solvepuzzle(newPuzzle);
    const maskedPuzzle = newPuzzle.map((val, i) =>
      Math.random() < difficultyLevels[difficulty] / 81 ? null : val
    );
    setPuzzle(maskedPuzzle);
    setSolution(newSolution);
    setMistakes(0);
    setHintCount(1);
    setHistory([]);
    setUserEntries(new Set());
  };

  const handleCellPress = (index) => {
    if (puzzle[index] === null || userEntries.has(index)) {
      setSelectedCell(index);
    }
  };

  const handleNumberPress = (number) => {
    if (selectedCell !== null) {
      const newPuzzle = [...puzzle];
      const prevPuzzle = [...puzzle];
      newPuzzle[selectedCell] = number - 1;

      setHistory([...history, prevPuzzle]);
      setPuzzle(newPuzzle);

      const newUserEntries = new Set(userEntries);
      newUserEntries.add(selectedCell);
      setUserEntries(newUserEntries);

      setSelectedCell(null);

      if (newPuzzle[selectedCell] !== solution[selectedCell]) {
        setMistakes(mistakes + 1);
      }
    }
  };

  const handleErase = () => {
    if (selectedCell !== null && userEntries.has(selectedCell)) {
      const newPuzzle = [...puzzle];
      newPuzzle[selectedCell] = null;
      setPuzzle(newPuzzle);

      const newUserEntries = new Set(userEntries);
      newUserEntries.delete(selectedCell);
      setUserEntries(newUserEntries);

      setSelectedCell(null);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setPuzzle(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const handleHint = () => {
    if (hintCount > 0) {
      const emptyCells = puzzle
        .map((val, idx) => (val === null ? idx : null))
        .filter((idx) => idx !== null);

      if (emptyCells.length > 0) {
        const randomIndex =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newPuzzle = [...puzzle];

        // Fill the correct value from the solution
        newPuzzle[randomIndex] = solution[randomIndex];

        setPuzzle(newPuzzle);
        setHintCount((prev) => prev - 1);

        // Add to userEntries to mark it as a filled cell
        setUserEntries((prevEntries) => new Set(prevEntries).add(randomIndex));
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={generateNewPuzzle}>
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSettings}>
            <FontAwesome name="cog" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {showSettings && (
          <View style={styles.settingsMenu}>
            <TouchableOpacity onPress={toggleMute} style={styles.settingItem}>
              <FontAwesome
                name={isMuted ? "volume-off" : "volume-up"}
                size={24}
                color="black"
              />
              <Text>{isMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBar}>
          <Text>Mistakes: {mistakes}</Text>
          <Picker
            selectedValue={difficulty}
            style={styles.picker}
            onValueChange={(itemValue) => setDifficulty(itemValue)}
          >
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
          <Text>{"Timer: " + formatTime(time)}</Text>
        </View>

        <View style={styles.sudokuGrid}>
          {puzzle.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cell,
                selectedCell === index && styles.selectedCell,
              ]}
              onPress={() => handleCellPress(index)}
            >
              <Text style={styles.cellText}>
                {value !== null ? value + 1 : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <ActionButton icon="undo" label="Undo" onPress={handleUndo} />
          <ActionButton icon="eraser" label="Erase" onPress={handleErase} />
          <ActionButton
            icon="lightbulb-o"
            label="Hint"
            onPress={handleHint}
            // notification={hintCount}
          />
        </View>

        <View style={styles.numberPad}>
          {Array.from({ length: 9 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNumberPress(index + 1)}
            >
              <Text style={styles.number}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ActionButton = ({ icon, label, onPress, notification }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <FontAwesome name={icon} size={24} color="black" />
    <Text>{label}</Text>
    {notification && (
      <View style={styles.notification}>
        <Text style={styles.notificationText}>{notification}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: { alignItems: "center", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  settingsMenu: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  infoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  picker: { height: 30, width: 100, marginVertical: 10 },
  sudokuGrid: {
    width: "100%",
    aspectRatio: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "black",
  },
  cell: {
    width: "11.11%",
    height: "11.11%",
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCell: { backgroundColor: "#d0e7ff" },
  cellText: { fontSize: 18 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 16,
  },
  actionButton: { alignItems: "center" },
  notification: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: { color: "white", fontSize: 10 },
  numberPad: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 16,
  },
  number: { fontSize: 24, color: "blue", fontWeight: "bold" },
});

export default SudokuGame;
