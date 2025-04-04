// import React, { useState } from "react";
// import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
// import images from "../assets/images/slideTile"; // Import image mappings

// const rows = 3;
// const columns = 3;
// const tileSize = 120; // Adjust tile size for spacing

// const initialImgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"]; // Image names
// const blankTile = "3"; // "3.jpg" is the blank tile

// export default function Puzzle() {
//   const [imgOrder, setImgOrder] = useState(initialImgOrder);
//   const [turns, setTurns] = useState(0);

//   const handleTilePress = (position) => {
//     const blankIndex = imgOrder.indexOf(blankTile);
//     const tileIndex = imgOrder.findIndex((_, index) => index === position);

//     const blankCoords = [
//       Math.floor(blankIndex / columns),
//       blankIndex % columns,
//     ];
//     const tileCoords = [Math.floor(tileIndex / columns), tileIndex % columns];

//     const isAdjacent =
//       (blankCoords[0] === tileCoords[0] &&
//         Math.abs(blankCoords[1] - tileCoords[1]) === 1) || // Same row
//       (blankCoords[1] === tileCoords[1] &&
//         Math.abs(blankCoords[0] - tileCoords[0]) === 1); // Same column

//     if (isAdjacent) {
//       const newImgOrder = [...imgOrder];
//       newImgOrder[blankIndex] = newImgOrder[tileIndex];
//       newImgOrder[tileIndex] = blankTile;

//       setImgOrder(newImgOrder);
//       setTurns(turns + 1);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.board}>
//         {imgOrder.map((imgName, index) => (
//           <TouchableOpacity key={index} onPress={() => handleTilePress(index)}>
//             <Image source={images[imgName]} style={styles.tile} />
//           </TouchableOpacity>
//         ))}
//       </View>
//       <Text style={styles.turnText}>Turns: {turns}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0f8ff",
//   },
//   board: {
//     width: columns * tileSize,
//     height: rows * tileSize,
//     backgroundColor: "lightblue",
//     borderWidth: 9,
//     borderColor: "#0c67ae",
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   tile: {
//     width: tileSize - 6, // Adjust for border
//     height: tileSize - 6,
//     borderWidth: 1,
//     borderColor: "#0c67ae",
//   },
//   turnText: {
//     fontSize: 24,
//     color: "#0c67ae",
//     marginTop: 20,
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const rows = 3;
const columns = 3;
const tileSize = 120;
const blankTile = "blank";
// const IMAGE_API = "https://jsonplaceholder.typicode.com/photos";
const IMAGE_API = "https://api.pexels.com/v1/curated";

const fetchImages = async () => {
  try {
    const response = await fetch(IMAGE_API, {
      headers: {
        Authorization:
          "A7oANLiDpQaHX4loLKqUfLin3hhXerZN1ANF6C3vIZTYTNtiHQjxgMyz",
      },
    });
    const images = await response.json();
    console.log("images", images);
    return images.map((img) => img.url); // Extract URLs
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

// Function to slice the image into 9 pieces
// const sliceImage = async (imageUri) => {
//   const tiles = [];
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < columns; col++) {
//       tiles.push({
//         id: `${row}-${col}`,
//         uri: `${imageUri}?crop=${col * 33},${row * 33},33,33`, // Simulate cropping
//       });
//     }
//   }
//   return tiles;
// };

// Simulate slicing by tracking position instead of actual cropping
const sliceImage = (imageUri) => {
  const tiles = [];
  let count = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      tiles.push({
        id: count.toString(),
        uri: imageUri,
        row,
        col,
      });
      count++;
    }
  }
  return tiles;
};

export default function Puzzle() {
  const [imgOrder, setImgOrder] = useState([]);
  const [imageTiles, setImageTiles] = useState([]);
  const [turns, setTurns] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuzzleImage();
  }, []);

  //   const fetchImage = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://jsonplaceholder.typicode.com/photos"
  //       );
  //       const imageUri = response.url;

  //       const tiles = await sliceImage(imageUri);
  //       const shuffledTiles = shuffleTiles(tiles);
  //       setImageTiles(shuffledTiles);
  //       setImgOrder(shuffledTiles.map((tile) => tile.id));
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching image:", error);
  //       setLoading(false);
  //     }
  //   };

  const fetchPuzzleImage = async () => {
    setLoading(true);
    const imageUrls = await fetchImages();

    console.log("imageUrls", imageUrls);

    if (imageUrls.length === 0) {
      setLoading(false);
      return;
    }

    const selectedImage = imageUrls[0]; // Choose the first image
    const tiles = sliceImage(selectedImage);

    if (!Array.isArray(tiles) || tiles.length === 0) {
      console.error("Error: Invalid tiles array");
      setLoading(false);
      return;
    }

    const shuffledTiles = shuffleTiles(tiles);

    setImageTiles(shuffledTiles);
    setImgOrder(shuffledTiles.map((tile) => tile.id));
    setLoading(false);
  };

  const shuffleTiles = (tiles) => {
    let shuffled = [...tiles];
    shuffled = shuffled.sort(() => Math.random() - 0.5);
    shuffled[shuffled.length - 1] = { id: blankTile, uri: null }; // Set last tile as blank
    return shuffled;
  };

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
        Math.abs(blankCoords[1] - tileCoords[1]) === 1) ||
      (blankCoords[1] === tileCoords[1] &&
        Math.abs(blankCoords[0] - tileCoords[0]) === 1);

    if (isAdjacent) {
      const newImgOrder = [...imgOrder];
      newImgOrder[blankIndex] = newImgOrder[tileIndex];
      newImgOrder[tileIndex] = blankTile;
      setImgOrder(newImgOrder);
      setTurns(turns + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0c67ae" />
        <Text>Loading Puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {imgOrder.map((tileId, index) => {
          const tile = imageTiles.find((t) => t.id === tileId);
          return (
            // <TouchableOpacity
            //   key={index}
            //   onPress={() => handleTilePress(index)}
            // >
            //   <Image
            //     source={tile.uri ? { uri: tile.uri } : null}
            //     style={[styles.tile, tileId === blankTile && styles.blankTile]}
            //   />
            // </TouchableOpacity>
            <TouchableOpacity
              key={index}
              onPress={() => handleTilePress(index)}
              style={styles.tileContainer}
            >
              {console.log("tile", tile)}
              {tile.uri ? (
                <Image
                  source={{ uri: tile.uri }}
                  style={[
                    styles.tile,
                    {
                      position: "absolute",
                      left: -(tile.col * tileSize),
                      top: -(tile.row * tileSize),
                    },
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.blankTile} />
              )}
            </TouchableOpacity>
          );
        })}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  board: {
    width: columns * tileSize,
    height: rows * tileSize,
    backgroundColor: "lightblue",
    borderWidth: 9,
    borderColor: "#0c67ae",
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
  },
  tileContainer: {
    width: tileSize,
    height: tileSize,
    overflow: "hidden",
  },
  tile: {
    // width: tileSize - 6,
    // height: tileSize - 6,
    // borderWidth: 1,
    // borderColor: "#0c67ae",
    width: columns * tileSize,
    height: rows * tileSize,
  },
  blankTile: {
    // opacity: 0,
    width: tileSize,
    height: tileSize,
    backgroundColor: "transparent",
  },
  turnText: {
    fontSize: 24,
    color: "#0c67ae",
    marginTop: 20,
  },
});
