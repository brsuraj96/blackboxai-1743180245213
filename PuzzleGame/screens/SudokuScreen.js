// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Picker,
//   Dimensions,
// } from "react-native";
// import { FontAwesome5 } from "@expo/vector-icons";
// import sudoku from "sudoku";

// const SudokuGame = () => {
//   const [puzzle, setPuzzle] = useState([]);
//   const [solution, setSolution] = useState([]);
//   const [selectedCell, setSelectedCell] = useState(null);
//   const [mistakes, setMistakes] = useState(0);
//   const [hintCount, setHintCount] = useState(8);
//   const [history, setHistory] = useState([]);
//   const [userEntries, setUserEntries] = useState(new Set());
//   const [difficulty, setDifficulty] = useState("easy");
//   const [time, setTime] = useState(0);
//   const [isMuted, setIsMuted] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );

//   useEffect(() => {
//     const updateDimensions = () => {
//       setScreenWidth(Dimensions.get("window").width);
//     };

//     Dimensions.addEventListener("change", updateDimensions);
//     return () => Dimensions.removeEventListener("change", updateDimensions);
//   }, []);

//   useEffect(() => {
//     generateNewPuzzle();
//     setTime(0);
//   }, [difficulty]);

//   useEffect(() => {
//     const interval = setInterval(() => setTime((prev) => prev + 1), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const isLandscape = screenWidth > 500;
//   const BOARD_SIZE = 9;

//   const generateNewPuzzle = () => {
//     const difficultyLevels = {
//       easy: { emptyCells: 30, hints: 8 },
//       medium: { emptyCells: 40, hints: 6 },
//       hard: { emptyCells: 50, hints: 4 },
//       expert: { emptyCells: 60, hints: 2 },
//     };

//     const { emptyCells, hints } = difficultyLevels[difficulty.toLowerCase()];
//     const newPuzzle = sudoku.makepuzzle();
//     const newSolution = sudoku.solvepuzzle(newPuzzle);
//     const maskedPuzzle = newPuzzle.map((val, i) =>
//       Math.random() < emptyCells / 81 ? null : val
//     );

//     setPuzzle(maskedPuzzle);
//     setSolution(newSolution);
//     setMistakes(0);
//     setHintCount(hints); // Set hints based on difficulty
//     setHistory([]);
//     setUserEntries(new Set());
//   };

//   const handleCellPress = (index) => {
//     if (puzzle[index] === null || userEntries.has(index)) {
//       setSelectedCell(index);
//     }
//   };

//   const handleNumberPress = (number) => {
//     if (selectedCell !== null) {
//       const newPuzzle = [...puzzle];
//       const prevPuzzle = [...puzzle];
//       newPuzzle[selectedCell] = number - 1;

//       setHistory([...history, prevPuzzle]);
//       setPuzzle(newPuzzle);

//       const newUserEntries = new Set(userEntries);
//       newUserEntries.add(selectedCell);
//       setUserEntries(newUserEntries);

//       setSelectedCell(null);

//       if (newPuzzle[selectedCell] !== solution[selectedCell]) {
//         setMistakes(mistakes + 1);
//       }
//     }
//   };

//   const handleErase = () => {
//     if (selectedCell !== null && userEntries.has(selectedCell)) {
//       const newPuzzle = [...puzzle];
//       newPuzzle[selectedCell] = null;
//       setPuzzle(newPuzzle);

//       const newUserEntries = new Set(userEntries);
//       newUserEntries.delete(selectedCell);
//       setUserEntries(newUserEntries);

//       setSelectedCell(null);
//     }
//   };

//   const handleUndo = () => {
//     if (history.length > 0) {
//       setPuzzle(history[history.length - 1]);
//       setHistory(history.slice(0, -1));
//     }
//   };

//   const handleHint = () => {
//     if (hintCount > 0) {
//       const emptyCells = puzzle
//         .map((val, idx) => (val === null ? idx : null))
//         .filter((idx) => idx !== null);

//       if (emptyCells.length > 0) {
//         const randomIndex =
//           emptyCells[Math.floor(Math.random() * emptyCells.length)];
//         const newPuzzle = [...puzzle];

//         newPuzzle[randomIndex] = solution[randomIndex];

//         setPuzzle(newPuzzle);
//         setHintCount((prev) => prev - 1);
//         setUserEntries((prevEntries) => new Set(prevEntries).add(randomIndex));
//       }
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const toggleMute = () => setIsMuted(!isMuted);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={
//           isLandscape ? styles.landscapeContainer : styles.portraitContainer
//         }
//       >
//         <View
//           style={{ width: isLandscape ? "45%" : "100%", alignItems: "center" }}
//         >
//           {!isLandscape && (
//             <View style={styles.header}>
//               <TouchableOpacity onPress={generateNewPuzzle}>
//                 <FontAwesome5 name="sync" size={24} color="black" />
//               </TouchableOpacity>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   width: "10%",
//                   margin: "0 auto",
//                 }}
//               >
//                 <TouchableOpacity
//                   onPress={toggleMute}
//                   style={styles.audioSetting}
//                 >
//                   <FontAwesome5
//                     name={isMuted ? "volume-mute" : "volume-up"}
//                     size={24}
//                     color={isMuted ? "gray" : "black"}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           <View style={styles.infoBar}>
//             <Text>Mistakes: {mistakes}</Text>
//             <Picker
//               selectedValue={difficulty}
//               style={styles.picker}
//               onValueChange={(itemValue) => setDifficulty(itemValue)}
//             >
//               <Picker.Item label="Easy" value="Easy" />
//               <Picker.Item label="Medium" value="Medium" />
//               <Picker.Item label="Hard" value="Hard" />
//               <Picker.Item label="Expert" value="Expert" />
//             </Picker>
//             <Text>{"Timer: " + formatTime(time)}</Text>
//           </View>

//           <View style={[styles.sudokuGrid, { height: isLandscape && "50%" }]}>
//             {/* {puzzle.map((value, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.cell,
//                   selectedCell === index && styles.selectedCell,
//                 ]}
//                 onPress={() => handleCellPress(index)}
//               >
//                 <Text style={styles.cellText}>
//                   {value !== null ? value + 1 : ""}
//                 </Text>
//               </TouchableOpacity>
//             ))} */}
//             {puzzle.map((value, index) => {
//               const row = Math.floor(index / BOARD_SIZE);
//               const col = index % BOARD_SIZE;

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.cell,
//                     selectedCell === index && styles.selectedCell,
//                     row % 3 === 2 &&
//                       row !== BOARD_SIZE - 1 &&
//                       styles.horizontalLine,
//                     col % 3 === 2 &&
//                       col !== BOARD_SIZE - 1 &&
//                       styles.verticalLine,
//                   ]}
//                   onPress={() => handleCellPress(index)}
//                 >
//                   <Text style={styles.cellText}>
//                     {value !== null ? value + 1 : ""}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         {isLandscape ? (
//           <View style={styles.sideControls}>
//             <View style={styles.header}>
//               <TouchableOpacity onPress={generateNewPuzzle}>
//                 <FontAwesome5 name="sync" size={24} color="black" />
//               </TouchableOpacity>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   width: "10%",
//                   margin: "0 auto",
//                 }}
//               >
//                 <TouchableOpacity
//                   onPress={toggleMute}
//                   style={styles.audioSetting}
//                 >
//                   <FontAwesome5
//                     name={isMuted ? "volume-mute" : "volume-up"}
//                     size={24}
//                     color={isMuted ? "gray" : "black"}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.numberGrid}>
//               {Array.from({ length: 9 }).map((_, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handleNumberPress(index + 1)}
//                 >
//                   <Text style={[styles.number, { fontSize: 40 }]}>
//                     {index + 1}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.actions}>
//               <ActionButton icon="undo" label="Undo" onPress={handleUndo} />
//               <ActionButton icon="eraser" label="Erase" onPress={handleErase} />
//               {hintCount > 0 ? (
//                 <ActionButton
//                   icon="lightbulb"
//                   label="Hint"
//                   onPress={handleHint}
//                   notification={hintCount}
//                 />
//               ) : (
//                 <ActionButton icon="lightbulb" label="Hint" isDisabled />
//               )}
//             </View>
//           </View>
//         ) : (
//           <>
//             <View style={styles.actions}>
//               <ActionButton icon="undo" label="Undo" onPress={handleUndo} />
//               <ActionButton icon="eraser" label="Erase" onPress={handleErase} />
//               {hintCount > 0 ? (
//                 <ActionButton
//                   icon="lightbulb"
//                   label="Hint"
//                   onPress={handleHint}
//                   notification={hintCount}
//                 />
//               ) : (
//                 <ActionButton icon="lightbulb" label="Hint" isDisabled />
//               )}
//             </View>

//             <View style={styles.numberPad}>
//               {Array.from({ length: 9 }).map((_, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handleNumberPress(index + 1)}
//                 >
//                   <Text style={styles.number}>{index + 1}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const ActionButton = ({ icon, label, onPress, notification, isDisabled }) => {
//   return (
//     <TouchableOpacity
//       style={[styles.actionButton, isDisabled && styles.disabledButton]}
//       onPress={!isDisabled ? onPress : null} // Disable press event if disabled
//       disabled={isDisabled}
//     >
//       <FontAwesome5
//         name={icon}
//         size={24}
//         color={isDisabled ? "gray" : "black"} // Gray out when disabled
//         style={isDisabled ? { opacity: 0.5 } : {}}
//       />
//       <Text style={isDisabled ? { color: "gray" } : {}}>{label}</Text>

//       {/* Show notification only if it exists and is not zero */}
//       {notification > 0 && (
//         <View style={styles.notification}>
//           <Text style={styles.notificationText}>{notification}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "white" },
//   portraitContainer: { alignItems: "center", padding: 16 },
//   landscapeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     padding: 16,
//     height: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     // paddingVertical: 8,
//   },
//   settingsMenu: {
//     backgroundColor: "#f8f8f8",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//   },
//   audioSetting: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     padding: 10,
//   },
//   infoBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//   },
//   picker: { height: 30, width: 100, marginVertical: 10 },
//   sudokuGrid: {
//     width: "100%",
//     aspectRatio: 1,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     borderWidth: 2,
//     borderColor: "black",
//   },
//   horizontalLine: { borderBottomWidth: 2, borderBottomColor: "black" },
//   verticalLine: { borderRightWidth: 2, borderRightColor: "black" },
//   sideControls: {
//     width: "40%",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "25px",
//   },
//   cell: {
//     width: "11.11%",
//     height: "11.11%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   selectedCell: { backgroundColor: "#d0e7ff" },
//   cellText: { fontSize: 18 },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingVertical: 16,
//   },
//   actionButton: {
//     alignItems: "center",
//     backgroundColor: "antiquewhite",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },
//   notification: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     backgroundColor: "red",
//     borderRadius: 8,
//     width: 16,
//     height: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   notificationText: { color: "white", fontSize: 10 },
//   numberPad: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//   },
//   wrap: {
//     flexWrap: "wrap",
//   },
//   number: { fontSize: 24, color: "blue", fontWeight: 500 },
//   numberGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     rowGap: "10px",
//     columnGap: "80px",
//     textAlign: "center",
//   },
// });

// export default SudokuGame;

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
// import Picker from "@react-native-picker/picker";
import DropdownMenu from "../components/Dropdown";
import { FontAwesome5 } from "@expo/vector-icons";
import sudoku from "sudoku";

const BOARD_SIZE = 9;

const SudokuGame = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintCount, setHintCount] = useState(8);
  const [history, setHistory] = useState([]);
  const [userEntries, setUserEntries] = useState(new Set());
  const [difficulty, setDifficulty] = useState("easy");
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const timerRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );
    return () => subscription?.remove(); // Cleanup listener
  }, []);

  useEffect(() => {
    generateNewPuzzle();
    setTime(0);
  }, [difficulty]);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const isLandscape = screenWidth > 500;

  const generateNewPuzzle = useCallback(() => {
    const difficultyLevels = {
      easy: { emptyCells: 20, hints: 8 },
      medium: { emptyCells: 30, hints: 6 },
      hard: { emptyCells: 40, hints: 4 },
      // expert: { emptyCells: 60, hints: 2 },
    };

    const { emptyCells, hints } = difficultyLevels[difficulty.toLowerCase()];
    const newPuzzle = sudoku.makepuzzle();
    const newSolution = sudoku.solvepuzzle(newPuzzle);
    const maskedPuzzle = newPuzzle.map((val, i) =>
      Math.random() < emptyCells / 81 ? null : val
    );

    setPuzzle(maskedPuzzle);
    setSolution(newSolution);
    setMistakes(0);
    setHintCount(hints);
    setHistory([]);
    setUserEntries(new Set());
  }, [difficulty]);

  const handleCellPress = useCallback(
    (index) => {
      if (puzzle[index] === null || userEntries.has(index)) {
        setSelectedCell(index);
      }
    },
    [puzzle, userEntries]
  );

  const handleNumberPress = useCallback(
    (number) => {
      if (selectedCell !== null) {
        setPuzzle((prevPuzzle) => {
          const newPuzzle = [...prevPuzzle];
          newPuzzle[selectedCell] = number - 1;
          return newPuzzle;
        });
        setUserEntries(
          (prevEntries) => new Set([...prevEntries, selectedCell])
        );
        setSelectedCell(null);
      }
    },
    [selectedCell]
  );

  const handleErase = useCallback(() => {
    if (selectedCell !== null && userEntries.has(selectedCell)) {
      setPuzzle((prevPuzzle) => {
        const newPuzzle = [...prevPuzzle];
        newPuzzle[selectedCell] = null;
        return newPuzzle;
      });
      setUserEntries((prevEntries) => {
        const newEntries = new Set(prevEntries);
        newEntries.delete(selectedCell);
        return newEntries;
      });
      setSelectedCell(null);
    }
  }, [selectedCell, userEntries]);

  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      setPuzzle(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [history]);

  const handleHint = useCallback(() => {
    if (hintCount > 0) {
      const emptyCells = puzzle.reduce((acc, val, idx) => {
        if (val === null) acc.push(idx);
        return acc;
      }, []);
      if (emptyCells.length > 0) {
        const randomIndex =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setPuzzle((prev) => {
          const newPuzzle = [...prev];
          newPuzzle[randomIndex] = solution[randomIndex];
          return newPuzzle;
        });
        setHintCount((prev) => prev - 1);
        setUserEntries((prev) => new Set(prev).add(randomIndex));
      }
    }
  }, [hintCount, puzzle, solution]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          isLandscape ? styles.landscapeContainer : styles.portraitContainer
        }
      >
        <View
          style={{ width: isLandscape ? "45%" : "100%", alignItems: "center" }}
        >
          {!isLandscape && (
            <View style={styles.header}>
              <TouchableOpacity onPress={generateNewPuzzle}>
                <FontAwesome5 name="sync" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.audioSettingContainer}>
                <TouchableOpacity
                  onPress={toggleMute}
                  style={styles.audioSetting}
                >
                  <FontAwesome5
                    name={isMuted ? "volume-mute" : "volume-up"}
                    size={24}
                    color={isMuted ? "gray" : "black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.infoBar}>
            <Text>Mistakes: {mistakes}</Text>
            {/* <Picker
              selectedValue={difficulty}
              style={styles.picker}
              onValueChange={(itemValue) => setDifficulty(itemValue)}
            >
              <Picker.Item label="Easy" value="Easy" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Hard" value="Hard" />
              <Picker.Item label="Expert" value="Expert" />
            </Picker> */}
            <DropdownMenu
              selectedValue={difficulty}
              onValueChange={(value) => setDifficulty(value)}
              items={[
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
              ]}
            />
            <Text>{"Timer: " + formatTime(time)}</Text>
          </View>

          <View style={[styles.sudokuGrid, { height: isLandscape && "50%" }]}>
            {puzzle.map((value, index) => {
              const row = Math.floor(index / BOARD_SIZE);
              const col = index % BOARD_SIZE;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cell,
                    selectedCell === index && styles.selectedCell,
                    row % 3 === 2 &&
                      row !== BOARD_SIZE - 1 &&
                      styles.horizontalLine,
                    col % 3 === 2 &&
                      col !== BOARD_SIZE - 1 &&
                      styles.verticalLine,
                  ]}
                  onPress={() => handleCellPress(index)}
                >
                  <Text style={styles.cellText}>
                    {value !== null ? value + 1 : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isLandscape ? (
          <View style={styles.sideControls}>
            <View style={styles.header}>
              <TouchableOpacity onPress={generateNewPuzzle}>
                <FontAwesome5 name="sync" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.audioSettingContainer}>
                <TouchableOpacity
                  onPress={toggleMute}
                  style={styles.audioSetting}
                >
                  <FontAwesome5
                    name={isMuted ? "volume-mute" : "volume-up"}
                    size={24}
                    color={isMuted ? "gray" : "black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.numberGrid}>
              {Array.from({ length: 9 }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNumberPress(index + 1)}
                >
                  <Text style={[styles.number, { fontSize: 40 }]}>
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.actions}>
              <ActionButton icon="undo" label="Undo" onPress={handleUndo} />
              <ActionButton icon="eraser" label="Erase" onPress={handleErase} />
              {hintCount > 0 ? (
                <ActionButton
                  icon="lightbulb"
                  label="Hint"
                  onPress={handleHint}
                  notification={hintCount}
                />
              ) : (
                <ActionButton icon="lightbulb" label="Hint" isDisabled />
              )}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.actions}>
              <ActionButton icon="undo" label="Undo" onPress={handleUndo} />
              <ActionButton icon="eraser" label="Erase" onPress={handleErase} />
              {hintCount > 0 ? (
                <ActionButton
                  icon="lightbulb"
                  label="Hint"
                  onPress={handleHint}
                  notification={hintCount}
                />
              ) : (
                <ActionButton icon="lightbulb" label="Hint" isDisabled />
              )}
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ActionButton = React.memo(
  ({ icon, label, onPress, notification, isDisabled }) => {
    return (
      <TouchableOpacity
        style={[styles.actionButton, isDisabled && styles.disabledButton]}
        onPress={!isDisabled ? onPress : null}
        disabled={isDisabled}
      >
        <FontAwesome5
          name={icon}
          size={24}
          color={isDisabled ? "gray" : "black"}
          style={isDisabled ? { opacity: 0.5 } : {}}
        />
        <Text style={isDisabled ? { color: "gray" } : {}}>{label}</Text>
        {notification > 0 && (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  portraitContainer: { alignItems: "center", padding: 16, gap: 20 },
  landscapeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  audioSettingContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "10%",
  },
  infoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
  horizontalLine: { borderBottomWidth: 3, borderBottomColor: "black" },
  verticalLine: { borderRightWidth: 3, borderRightColor: "black" },
  sideControls: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    gap: "25px",
  },
  cell: {
    width: "11.11%",
    height: "11.11%",
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCell: { backgroundColor: "antiquewhite" },
  cellText: { fontSize: 18 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // paddingVertical: 16,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "antiquewhite",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
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
    // paddingVertical: 16,
  },
  number: { fontSize: 24, color: "blue", fontWeight: "bold" },
  numberGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    rowGap: "10px",
    columnGap: "80px",
    textAlign: "center",
  },
});

export default SudokuGame;
