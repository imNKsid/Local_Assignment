import {
  FlatList,
  Image,
  Linking,
  TouchableOpacity,
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
      contact_preference,
      custom_link,
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
              <Text style={[styles.text, styles.boldText]}>{"Salary: "}</Text>
              <Text style={styles.text}>{primary_details?.Salary}</Text>
            </View>
            {detailIndex === index ? (
              <>
                <View style={styles.salaryView}>
                  <Text style={[styles.text, styles.boldText]}>
                    {"Experience: "}
                  </Text>
                  <Text style={styles.text}>{primary_details?.Experience}</Text>
                </View>
                <View style={styles.salaryView}>
                  <Text style={[styles.text, styles.boldText]}>
                    {"Qualification: "}
                  </Text>
                  <Text style={styles.text}>
                    {primary_details?.Qualification}
                  </Text>
                </View>
                <View style={styles.salaryView}>
                  {job_tags.map((item: any, index: number) => {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.tagsView,
                          {
                            backgroundColor: item?.bg_color,
                            marginLeft: index === 0 ? 0 : 10,
                          },
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
              </>
            ) : null}
            <View style={styles.textNimg}>
              <TouchableOpacity onPress={() => Linking.openURL(custom_link)}>
                <Text style={styles.text}>{button_text}</Text>
              </TouchableOpacity>
              {detailIndex === index ? (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(contact_preference?.whatsapp_link)
                    }
                    style={[styles.salaryView, styles.topFive]}
                  >
                    <Image
                      source={IMAGES.whatsapp}
                      style={styles.whatsappIcon}
                    />
                    <Text style={styles.whatsappNo}>{"Ping on WhatsApp"}</Text>
                  </TouchableOpacity>
                  <View style={[styles.salaryView, styles.topFive]}>
                    <Image source={IMAGES.location} style={styles.pin} />
                    <Text style={styles.whatsappNo}>
                      {primary_details?.Place}
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{"Job Listings"}</Text>
      <FlatList
        data={data}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 50 }} />}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
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
    paddingLeft: 15,
    paddingVertical: 10,
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
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.black,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 5,
  },
  boldText: { fontSize: 15, fontWeight: "500" },
  salaryView: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagsView: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  tagsText: {
    color: "#fff",
  },
  topFive: { marginTop: 5 },
  whatsappIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  whatsappNo: {
    marginLeft: 5,
  },
  pin: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
