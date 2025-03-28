import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
// @ts-ignore
import ConfettiCannon from 'react-native-confetti-cannon';

type Tile = {
  value: number;
  isEmpty: boolean;
  animValue: Animated.Value;
};

type Difficulty = 'easy' | 'medium' | 'hard';
type HighScore = {
  moves: number;
  time: number;
  date: string;
};

const EnhancedPuzzleGame = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScores, setHighScores] = useState<Record<Difficulty, HighScore[]>>({
    easy: [],
    medium: [],
    hard: []
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const confettiRef = useRef<any>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Initialize sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3' }
        );
        soundRef.current = sound;
      } catch (error) {
        console.warn("Couldn't load sound", error);
      }
    };
    loadSounds();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.warn("Couldn't play sound", error);
    }
  };

  const startNewGame = () => {
    const size = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const totalTiles = size * size - 1;
    
    // Create ordered tiles with animations
    const orderedTiles = Array.from({ length: totalTiles }, (_, i) => ({
      value: i + 1,
      isEmpty: false,
      animValue: new Animated.Value(1)
    }));
    orderedTiles.push({ value: size * size, isEmpty: true, animValue: new Animated.Value(1) });
    
    // Shuffle tiles
    const shuffledTiles = [...orderedTiles];
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
    }
    
    setTiles(shuffledTiles);
    setMoves(0);
    setTime(0);
    setGameWon(false);
    setIsTimerRunning(true);
  };

  const handleTilePress = async (index: number) => {
    if (gameWon || tiles[index].isEmpty) return;

    const emptyIndex = tiles.findIndex(tile => tile.isEmpty);
    const size = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    // Check if the tile is adjacent to the empty space
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      await playSound();
      
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      
      // Animate the tile movement
      Animated.sequence([
        Animated.timing(newTiles[index].animValue, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(newTiles[index].animValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ]).start();

      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if puzzle is solved
      const isSolved = newTiles.every((tile, i) => 
        tile.isEmpty || tile.value === i + 1
      );
      if (isSolved) {
        setIsTimerRunning(false);
        setGameWon(true);
        confettiRef.current?.start();
        
        // Save high score
        const newHighScores = {...highScores};
        newHighScores[difficulty].push({
          moves: moves + 1,
          time,
          date: new Date().toLocaleDateString()
        });
        newHighScores[difficulty].sort((a, b) => a.moves - b.moves);
        setHighScores(newHighScores);
        
        Alert.alert(
          'Congratulations!', 
          `You solved the ${difficulty} puzzle in ${moves + 1} moves and ${formatTime(time)}!`
        );
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderTile = (tile: Tile, index: number) => {
    const size = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const tileSize = Dimensions.get('window').width * 0.8 / size;
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleTilePress(index)}
        disabled={tile.isEmpty}
      >
        <Animated.View
          style={[
            styles.tile,
            tile.isEmpty ? styles.emptyTile : styles.filledTile,
            {
              width: tileSize,
              height: tileSize,
              transform: [{ scale: tile.animValue }]
            }
          ]}
        >
          {!tile.isEmpty && (
            <Text style={styles.tileText}>{tile.value}</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderHighScores = () => {
    return (
      <View style={styles.highScoresContainer}>
        <Text style={styles.highScoresTitle}>High Scores</Text>
        {highScores[difficulty].slice(0, 5).map((score, i) => (
          <Text key={i} style={styles.highScore}>
            #{i+1}: {score.moves} moves in {formatTime(score.time)} on {score.date}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Sliding Puzzle</Text>
      
      <View style={styles.difficultyContainer}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
          <TouchableOpacity
            key={diff}
            style={[
              styles.difficultyButton,
              difficulty === diff && styles.selectedDifficulty
            ]}
            onPress={() => {
              setDifficulty(diff);
              startNewGame();
            }}
          >
            <Text style={styles.difficultyText}>{diff}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Moves: {moves}</Text>
        <Text style={styles.statsText}>Time: {formatTime(time)}</Text>
      </View>
      
      <View style={[
        styles.board, 
        { 
          width: Dimensions.get('window').width * 0.8,
          height: Dimensions.get('window').width * 0.8
        }
      ]}>
        {tiles.map((tile, index) => renderTile(tile, index))}
      </View>

      <TouchableOpacity style={styles.button} onPress={startNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>

      {renderHighScores()}

      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{x: Dimensions.get('window').width / 2, y: 0}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  difficultyButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  selectedDifficulty: {
    backgroundColor: '#4CAF50',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 2,
  },
  filledTile: {
    backgroundColor: '#fff',
  },
  emptyTile: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  highScoresContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  highScoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  highScore: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default EnhancedPuzzleGame;