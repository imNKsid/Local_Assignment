import {
  FlatList,
  Image,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Button,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS, IMAGES } from "../assets";
import { useDispatch } from "react-redux";
import JobsThunk from "../redux/jobs/jobs-thunk";
import JobsSelector from "../redux/jobs/jobs-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("screen");

const Home = () => {
  const dispatch: any = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailIndex, setDetailIndex] = useState(-1);
  const [isListRendered, setIsListRendered] = useState(false);

  const getJobsSuccess = JobsSelector.getJobsSuccess();
  const jobsList = JobsSelector.jobsList();
  const getJobsFailure = JobsSelector.getJobsFailure();

  const checkCache = async () => {
    const time = await AsyncStorage.getItem("cacheTime");
    console.log("time =>", time);

    if (!time) {
      console.log("Setting time");
      AsyncStorage.setItem("cacheTime", Date.now().toString());
      fetchData();
    } else if (time && Date.now() - parseInt(time) < 2 * 60 * 60 * 1000) {
      // do nothing
    }
  };

  const fetchData = () => {
    dispatch(JobsThunk.getJobsData({}));
  };

  useEffect(() => {
    checkCache();
  }, []);

  useEffect(() => {
    console.log("getJobsSuccess =>", getJobsSuccess, getJobsFailure);

    if (getJobsSuccess) {
      setData(jobsList);
      setLoading(false);
    }
  }, [getJobsSuccess, jobsList]);

  useEffect(() => {
    if (getJobsFailure) {
      setLoading(false);
    }
  }, [getJobsFailure]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  }, [loading]);

  const renderJob = ({ item, index }: any) => {
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

  const fetchMoreData = useCallback(() => {
    if (!isListRendered) return;

    if (page < 3) {
      dispatch(JobsThunk.getJobsData({ page: page + 1, loadMore: true })).then(
        () => setPage((prev) => prev + 1)
      );
    }
  }, [isListRendered, page]);

  const EmptyList = () => {
    return (
      <>
        <View style={styles.emptyContainer}>
          <Text style={styles.text}>{"Oops! Retry Again"}</Text>
          <Button title="Retry" onPress={fetchData} />
        </View>
      </>
    );
  };

  const onRefresh = useCallback(() => {
    setLoading(true);
    setPage(1);
    dispatch(JobsThunk.getJobsData({ page: 1 }))
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{"Job Listings"}</Text>

      <FlatList
        data={data}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.0}
        onEndReached={fetchMoreData}
        onContentSizeChange={() => setIsListRendered(true)}
        keyExtractor={(_item, index) => index.toString()}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{ marginBottom: 50 }} />}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size={50} color={COLORS.black} />
          <Text style={styles.text}>{"Loading"}</Text>
        </View>
      ) : null}
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
  emptyContainer: {
    flex: 1,
    marginTop: height * 0.35,
  },
  loader: {
    flex: 1,
    zIndex: 5,
    marginTop: height * 0.35,
  },
});
