import React from "react";
import Svg, { Circle } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";

interface CircularProgressBarProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  value,
  max,
  size = 60,
  strokeWidth = 10,
  color = "white",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (value / max) * 100;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#454545"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.iconContainer}>
        <Icon source="arrow-right" size={20} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30, // Adjust based on your size and design
    padding: 5,
    backgroundColor: "transparent",
  },
});

export default CircularProgressBar;
