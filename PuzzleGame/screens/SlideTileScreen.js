import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import images from "../assets/images/slideTile"; // Import image mappings

const rows = 3;
const columns = 3;
const tileSize = 120; // Adjust tile size for spacing

const initialImgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"]; // Image names
const blankTile = "3"; // "3.jpg" is the blank tile

export default function Puzzle() {
  const [imgOrder, setImgOrder] = useState(initialImgOrder);
  const [turns, setTurns] = useState(0);

  const handleTilePress = (position) => {
    const blankIndex = imgOrder.indexOf(blankTile);
    const tileIndex = imgOrder.findIndex((_, index) => index === position);

    const blankCoords = [
      Math.floor(blankIndex / columns),
      blankIndex % columns,
    ];
    const tileCoords = [Math.floor(tileIndex / columns), tileIndex % columns];

    const isAdjacent =
      (blankCoords[0] === tileCoords[0] &&
        Math.abs(blankCoords[1] - tileCoords[1]) === 1) || // Same row
      (blankCoords[1] === tileCoords[1] &&
        Math.abs(blankCoords[0] - tileCoords[0]) === 1); // Same column

    if (isAdjacent) {
      const newImgOrder = [...imgOrder];
      newImgOrder[blankIndex] = newImgOrder[tileIndex];
      newImgOrder[tileIndex] = blankTile;

      setImgOrder(newImgOrder);
      setTurns(turns + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {imgOrder.map((imgName, index) => (
          <TouchableOpacity key={index} onPress={() => handleTilePress(index)}>
            <Image source={images[imgName]} style={styles.tile} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.turnText}>Turns: {turns}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  board: {
    width: columns * tileSize,
    height: rows * tileSize,
    backgroundColor: "lightblue",
    borderWidth: 9,
    borderColor: "#0c67ae",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    width: tileSize - 6, // Adjust for border
    height: tileSize - 6,
    borderWidth: 1,
    borderColor: "#0c67ae",
  },
  turnText: {
    fontSize: 24,
    color: "#0c67ae",
    marginTop: 20,
  },
});
