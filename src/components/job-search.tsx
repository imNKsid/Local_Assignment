import {
  Button,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, IMAGES } from "../assets";

const { width } = Dimensions.get("screen");

type JobSearchModalProps = {
  isVisible: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
  setJobTitle: (text: string) => void;
  setCompanyName: (text: string) => void;
  onSearch: () => void;
};

const JobSearch = (props: JobSearchModalProps) => {
  const {
    isVisible,
    onClose,
    jobTitle,
    setJobTitle,
    companyName,
    setCompanyName,
    onSearch,
  } = props;

  return (
    <View>
      <Modal
        transparent={true}
        animationType={"none"}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTxt}>{"Search Jobs"}</Text>
              <TouchableOpacity onPress={onClose}>
                <Image source={IMAGES.close} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.descTxt}>{"Search by job title"}</Text>
            <TextInput
              placeholder={"Search Job Title"}
              placeholderTextColor={COLORS.greyishWhite}
              style={styles.field}
              value={jobTitle}
              onChangeText={setJobTitle}
            />
            <Text style={styles.descTxt}>{"Search by company name"}</Text>
            <TextInput
              placeholder={"Search Company Name"}
              placeholderTextColor={COLORS.greyishWhite}
              style={styles.field}
              value={companyName}
              onChangeText={setCompanyName}
            />
            <View style={styles.btnView}>
              <Button title={"Search"} onPress={onSearch} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default JobSearch;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000040",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: COLORS.grey,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  headerTxt: {
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center",
    width: "90%",
    marginLeft: 10,
  },
  closeIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    tintColor: COLORS.black,
  },
  descTxt: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: "left",
    marginLeft: 20,
  },
  field: {
    marginLeft: 20,
    width: width * 0.8,
    color: COLORS.black,
    fontSize: 14,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnView: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 50,
  },
});
