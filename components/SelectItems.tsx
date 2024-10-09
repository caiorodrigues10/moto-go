import { Feather } from "@expo/vector-icons";
import React, { ReactNode, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
  disabled?: boolean;
  placeholder: string;
  onSelect: (option: Option) => void;
  defaultValue?: string;
  styles?: {
    styleContent?: object;
    styleList?: object;
    styleItem?: object;
    stylePlaceholder?: object;
    styleInput?: object;
    errorMessage?: object;
  };
  isInvalid?: boolean;
  errorMessage?: string;
  value?: string;
}

export const SelectItems: React.FC<SelectProps> = ({
  options,
  placeholder,
  onSelect,
  defaultValue,
  styles,
  disabled = false,
  isInvalid,
  errorMessage,
  value,
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

  useEffect(() => {
    if (value) {
      handleSelect(options?.find((e) => e.value === value) || ({} as Option));
    }
  }, [value, options]);

  return (
    <View style={[styles?.styleContent, styleSheet.container]}>
      <Pressable
        ref={ref}
        onPress={() => !disabled && setShowOptions(!showOptions)}
        style={[styles?.styleInput, styleSheet.input]}
      >
        <GilroyText
          style={[
            styles?.stylePlaceholder,
            !selectedValue ? styleSheet.placeholder : styleSheet.itemSelected,
          ]}
        >
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
      <GilroyText style={[styleSheet.errorMessage, styles?.errorMessage]}>
        {isInvalid && errorMessage && errorMessage}
      </GilroyText>
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
                <GilroyText style={{ color: "white" }}>{item?.icon}</GilroyText>
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
    zIndex: 999,
    gap: 4,
  },
  input: {
    borderColor: "#ffffff40",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: {
    color: "white",
    opacity: 0.5,
    fontSize: 16,
  },
  itemSelected: {
    color: "white",
    fontSize: 16,
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
    backgroundColor: "#2a3240",
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
    color: "white",
  },
  errorMessage: {
    color: "#F87171",
    height: 14,
  },
});
