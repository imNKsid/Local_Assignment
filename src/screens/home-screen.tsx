import {
  FlatList,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { COLORS, IMAGES } from "../assets";

const API_URL = "https://testapi.getlokalapp.com/common/jobs?page=1";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [detailIndex, setDetailIndex] = useState(-1);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res: any = await axios.get(API_URL);
      //   console.log("res =>", JSON.stringify(res));
      if (res?.data?.results) {
        setData(res.data.results);
        setLoading(false);
      }
    } catch (err) {
      console.log("err =>", err);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderJob = ({ item, index }: any) => {
    console.log("item =>", item);

    const {
      title,
      primary_details,
      company_name,
      button_text,
      custom_link,
      whatsapp_no,
      job_tags,
    } = item;

    if (!title) {
      return null;
    }
    return (
      <View style={styles.jobBox}>
        <View style={styles.textNimg}>
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{title}</Text>
            <Text style={styles.text}>{company_name}</Text>
            <View style={styles.salaryView}>
              <Text style={styles.text}>{"Salary: "}</Text>
              <Text style={styles.text}>{primary_details?.Salary}</Text>
            </View>
            {detailIndex === index ? (
              <View style={styles.salaryView}>
                {job_tags.map((item: any, index: number) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.tagsView,
                        { backgroundColor: item?.bg_color },
                      ]}
                    >
                      <Text
                        style={[styles.tagsText, { color: item?.text_color }]}
                      >
                        {item?.value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
            <Pressable onPress={() => Linking.openURL(custom_link)}>
              <Text style={styles.text}>{whatsapp_no}</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              if (detailIndex === index) {
                setDetailIndex(-1);
              } else {
                setDetailIndex(index);
              }
            }}
          >
            <Image
              source={detailIndex === index ? IMAGES.arrowUp : IMAGES.arrowDown}
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{"Jobs Listed"}</Text>
      <FlatList
        data={data}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  jobBox: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 5,
  },
  textNimg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  jobDetails: {
    width: "90%",
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.black,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 5,
  },
  salaryView: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagsView: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  tagsText: {
    color: "#fff",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
