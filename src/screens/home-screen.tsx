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
  StatusBar,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS, IMAGES } from "../assets";
import { useDispatch } from "react-redux";
import JobsThunk from "../redux/jobs/jobs-thunk";
import JobsSelector from "../redux/jobs/jobs-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { JobSearch } from "../components";

const { height } = Dimensions.get("screen");
const isIOS = Platform.OS === "ios";

const Home = () => {
  const dispatch: any = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailIndex, setDetailIndex] = useState(-1);
  const [isListRendered, setIsListRendered] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const getJobsSuccess = JobsSelector.getJobsSuccess();
  const jobsList = JobsSelector.jobsList();
  const getJobsFailure = JobsSelector.getJobsFailure();

  const checkCache = async () => {
    try {
      const time = await AsyncStorage.getItem("cacheTime");
      const jobListData = await AsyncStorage.getItem("cacheData");
      console.log("time =>", time);
      console.log("jobListData =>", jobListData?.length);

      if (!time) {
        console.log("Setting time");
        AsyncStorage.setItem("cacheTime", Date.now().toString());
        fetchData();
      } else if (time && Date.now() - parseInt(time) < 2 * 60 * 60 * 1000) {
        console.log("Setting previous data");
        setData(JSON.parse(jobListData ?? ""));
      } else {
        console.log("Cache expired: Fetching new data...");
        fetchData();
      }
    } catch (error) {
      console.error("Error checking cache:", error);
      AsyncStorage.setItem("cacheTime", Date.now().toString());
      fetchData(); // Fetch new data if there's an error with cache
    }
  };

  const fetchData = () => {
    setLoading(true);
    setIsSearchActive(false);
    dispatch(JobsThunk.getJobsData({}))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    checkCache();
  }, []);

  useEffect(() => {
    console.log("getJobsSuccess =>", getJobsSuccess, getJobsFailure);

    if (getJobsSuccess) {
      setData(jobsList);
      AsyncStorage.setItem("cacheData", JSON.stringify(jobsList));
      setLoading(false);
    }
  }, [getJobsSuccess, jobsList]);

  useEffect(() => {
    if (getJobsFailure) {
      setData([]);
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
                <Text style={[styles.text, styles.textSize]}>
                  {button_text}
                </Text>
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
                    <Text style={[styles.whatsappNo, styles.textSize]}>
                      {"Ping on WhatsApp"}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.salaryView, styles.topFive]}>
                    <Image source={IMAGES.location} style={styles.pin} />
                    <Text
                      numberOfLines={1}
                      style={[styles.whatsappNo, styles.textSize]}
                    >
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

  const fetchMoreData = useCallback(async () => {
    if (!isListRendered) return;
    if (isSearchActive) {
      return;
    }

    if (page < 3) {
      dispatch(JobsThunk.getJobsData({ page: page + 1, loadMore: true })).then(
        () => setPage((prev) => prev + 1)
      );
    }
  }, [isListRendered, isSearchActive, page]);

  const EmptyList = () => {
    return (
      <>
        <View style={styles.emptyContainer}>
          <Text style={[styles.text, { marginBottom: 10 }]}>
            {"Oops! Retry Again"}
          </Text>
          <Button title="Retry" onPress={fetchData} />
        </View>
      </>
    );
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    setIsSearchActive(false);
    dispatch(JobsThunk.getJobsData({ page: 1 }));
  }, []);

  const handleSearch = () => {
    let searchMenuItems = [];
    if (jobTitle.length > 0 && company.length > 0) {
      searchMenuItems = jobsList.filter((item: any) => {
        item?.title?.toLowerCase().includes(jobTitle.toLowerCase()) &&
          item?.company_name?.toLowerCase().includes(company.toLowerCase());
      });
    } else if (jobTitle.length > 0) {
      searchMenuItems = jobsList.filter((item: any) =>
        item?.title?.toLowerCase().includes(jobTitle.toLowerCase())
      );
    } else if (company.length > 0) {
      searchMenuItems = jobsList.filter((item: any) =>
        item?.company_name?.toLowerCase().includes(company.toLowerCase())
      );
    }
    console.log("searchMenuItems =>", searchMenuItems?.length);

    setData(searchMenuItems);
    setShowSearch(false);
    setIsSearchActive(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.grey} barStyle={"dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerTxt}>{"Job Listings"}</Text>
        <TouchableOpacity onPress={() => setShowSearch(true)}>
          <Image source={IMAGES.search} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={fetchMoreData}
        onContentSizeChange={() => setIsListRendered(true)}
        keyExtractor={(_item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{ marginBottom: 50 }} />}
      />
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.text}>{"Loading"}</Text>
        </View>
      ) : data.length === 0 ? (
        <EmptyList />
      ) : null}
      {showSearch ? (
        <JobSearch
          isVisible={true}
          onClose={() => setShowSearch(false)}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          companyName={company}
          setCompanyName={setCompany}
          onSearch={handleSearch}
        />
      ) : null}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerTxt: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.black,
  },
  searchIcon: {
    width: 25,
    height: 25,
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
    marginLeft: isIOS ? 5 : 2,
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
    marginBottom: height * 0.25,
    alignItems: "center",
  },
  loader: {
    flex: 1,
    zIndex: 5,
    alignItems: "center",
    borderWidth: 1,
  },
  textSize: {
    fontSize: isIOS ? 14 : 12,
  },
});
