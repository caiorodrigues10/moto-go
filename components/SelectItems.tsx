import React, { ReactNode, useState } from "react";
import {
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useClickOutside } from "react-native-click-outside";
import { GilroyText } from "./GilroyText";

interface Option {
  label: string;
  value: string;
  icon?: string | ReactNode;
  showValue?: string;
}

interface SelectProps {
  options: Option[];
  placeholder: string;
  onSelect: (option: Option) => void;
  defaultValue?: string;
  styles?: {
    styleContent?: object;
    styleList?: object;
    styleItem?: object;
    stylePlaceholder?: object;
    styleInput?: object;
  };
}

export const SelectItems: React.FC<SelectProps> = ({
  options,
  placeholder,
  onSelect,
  defaultValue,
  styles,
}) => {
  const [selectedValue, setSelectedValue] = useState<Option | null>(
    options?.find((e) => e.value === defaultValue) || null
  );
  const [showOptions, setShowOptions] = useState(false);

  const ref = useClickOutside<View>(() => showOptions && setShowOptions(false));

  const handleSelect = (option: Option) => {
    setSelectedValue(option);
    setShowOptions(false);
    onSelect(option);
  };

  return (
    <View style={[styles?.styleContent, styleSheet.container]}>
      <Pressable
        ref={ref}
        onPress={() => setShowOptions(!showOptions)}
        style={[styles?.styleInput, styleSheet.input]}
      >
        <GilroyText style={[styles?.stylePlaceholder, styleSheet.placeholder]}>
          {selectedValue
            ? selectedValue?.showValue || selectedValue.label
            : placeholder}
        </GilroyText>
        <Feather
          name={showOptions ? "chevron-up" : "chevron-down"}
          size={20}
          color="gray"
        />
      </Pressable>
      {showOptions && (
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          style={[
            styles?.styleList,
            styleSheet.list,
            { zIndex: 1000, elevation: 10 },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles?.styleItem, styleSheet.item]}
              onPress={() => handleSelect(item)}
            >
              {typeof item?.icon === "string" ? (
                <GilroyText>{item?.icon}</GilroyText>
              ) : (
                item?.icon
              )}
              <GilroyText style={styleSheet.itemText}>{item.label}</GilroyText>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styleSheet = StyleSheet.create({
  container: {
    zIndex: 999, // Certifique-se de que o contêiner pai tenha um zIndex alto
  },
  input: {
    borderColor: "#ffffff40",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: {
    color: "white",
    opacity: 0.7,
  },
  list: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 16,
    maxHeight: 240,
    position: "absolute",
    top: 40,
    width: "100%",
    backgroundColor: "white",
    zIndex: 1000,
  },
  item: {
    padding: 12,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  itemText: {
    fontSize: 16,
    color: "gray",
  },
});
