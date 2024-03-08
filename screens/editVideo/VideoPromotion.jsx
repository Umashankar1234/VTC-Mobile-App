/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Tab,
  TabBar,
  ViewPager,
  Input,
  Spinner,
} from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { getItem, getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import {
  fetchRecords,
  postMethod,
  fileUploadMethod,
} from "../commons/Services";
import { useAuthorization } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from "expo-image-picker";

import {
  faUser,
  faCamera,
  faAddressCard,
  faImages,
  faIdCardAlt,
  faSdCard,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Button, TextInput, Switch } from "react-native-paper";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";

const CameraIcon = (props) => (
  <FontAwesomeIcon icon={faCamera} size={25} color={"#FFA12D"} />
);

const AddressIcon = (props) => (
  <FontAwesomeIcon icon={faAddressCard} size={25} color={"#FFA12D"} />
);

const GalleryIcon = (props) => (
  <FontAwesomeIcon icon={faImages} size={25} color={"#FFA12D"} />
);

const VideoPromotion = ({ route }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();

  const { status, authToken } = useMemo(() => useAuthorization(), []);

  const [agentId, setAgentId] = useState();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    if (isFocused) fetch();
  }, [isFocused]);
  const onSubmit = async (data) => {
    setLoading(true);
    const url = "update-promotions";
    const apiData = {
      agent_id: agentId,
      tourId: tourid,
      ...data,
    };
    const res = await axiosPost(url, apiData);
    setLoading(false);
    if (res.data[0].response.status === "success") {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    }
  };
  const YoutubeTab = useCallback(() => {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        ContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.uploadImages} level="2">
          <View style={styles.formWrapCard}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  error={errors.videotitle}
                  style={styles.formControl}
                  label="Title"
                  value={value}
                  name="Title"
                  right={<TextInput.Icon icon="account" />}
                  onChangeText={(value) => onChange(value)}
                />
              )}
              name="videotitle"
              rules={{
                required: { value: true, message: "Video Title is required" },
              }}
            />
            {errors.videotitle && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.videotitle?.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  error={errors.videodescription}
                  style={styles.formControl}
                  label="Video Description"
                  numberOfLines={4}
                  multiline={true}
                  value={value}
                  name="videodescription"
                  right={<TextInput.Icon icon="account" />}
                  onChangeText={(value) => onChange(value)}
                />
              )}
              name="videodescription"
              rules={{
                required: {
                  value: true,
                  message: "Video Description is required",
                },
              }}
            />
            {errors.videodescription && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.videodescription?.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  error={errors.videokeywords}
                  style={styles.formControl}
                  label="Keywords (Comma Seperated Each Keyword Max:30, Min:2)(Total Max:500)"
                  numberOfLines={5}
                  multiline={true}
                  value={value}
                  name="videokeywords"
                  right={<TextInput.Icon icon="account" />}
                  onChangeText={(value) => onChange(value)}
                />
              )}
              name="videokeywords"
              rules={{
                required: {
                  value: true,
                  message: "Video Description is required",
                },
              }}
            />
            {errors.videokeywords && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.videokeywords?.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  error={errors.youtubelink}
                  style={styles.formControl}
                  label="Link"
                  value={value}
                  name="Link"
                  right={<TextInput.Icon icon="account" />}
                  onChangeText={(value) => onChange(value)}
                />
              )}
              name="youtubelink"
              // rules={{
              //   required: { value: true, message: "Video Title is required" },
              // }}
            />
            {errors.youtubelink && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.youtubelink?.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  error={errors.vimeolink}
                  style={styles.formControl}
                  label="Vimeo Link"
                  value={value}
                  name="Link"
                  right={<TextInput.Icon icon="account" />}
                  onChangeText={(value) => onChange(value)}
                />
              )}
              name="vimeolink"
              // rules={{
              //   required: { value: true, message: "Video Title is required" },
              // }}
            />
            {errors.vimeolink && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.vimeolink?.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.selectTag}>
                  <Text>Post To Youtube?</Text>
                  <Switch
                    value={value}
                    onValueChange={(value) => onChange(value)}
                    style={{ alignSelf: "flex-start" }}
                  />
                </View>
              )}
              name="posttoyoutube"
              // rules={{
              //   required: { value: true, message: "Video Title is required" },
              // }}
            />
            {errors.posttoyoutube && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.posttoyoutube?.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.selectTag}>
                  <Text>Post To Vimeo?</Text>
                  <Switch
                    value={value}
                    onValueChange={(value) => onChange(value)}
                    style={{ alignSelf: "flex-start" }}
                  />
                </View>
              )}
              name="posttovimeo"
              // rules={{
              //   required: { value: true, message: "Video Title is required" },
              // }}
            />
            {errors.posttovimeo && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.posttovimeo?.message}
              </Text>
            )}
            <SubmitButton />
          </View>
        </View>
      </ScrollView>
    );
  }, []);
  const TruveoTab = useCallback(() => {
    return (
      <View style={[styles.uploadImages]} level="2">
        <View style={styles.formWrapCard}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.selectTag}>
                <Text>Enable Video For Truveo?</Text>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                  style={{ alignSelf: "flex-start" }}
                />
              </View>
            )}
            name="posttotruveo"
            // rules={{
            //   required: { value: true, message: "Video Title is required" },
            // }}
          />
          {errors.posttotruveo && (
            <Text style={styles.errorMsg} status="danger">
              {errors?.posttotruveo?.message}
            </Text>
          )}
          <SubmitButton />
        </View>
      </View>
    );
  }, []);
  const PodCastTab = useCallback(() => {
    return (
      <View style={styles.uploadImages} level="2">
        <View style={styles.formWrapCard}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.selectTag}>
                <Text>Enable Video For Podcast?</Text>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                  style={{ alignSelf: "flex-start" }}
                />
              </View>
            )}
            name="posttopodcast"
            // rules={{
            //   required: { value: true, message: "Video Title is required" },
            // }}
          />
          {errors.posttopodcast && (
            <Text style={styles.errorMsg} status="danger">
              {errors?.posttopodcast?.message}
            </Text>
          )}
          <SubmitButton />
        </View>
      </View>
    );
  }, []);
  const SubmitButton = useCallback(
    () => (
      <Button
        style={styles.saveButton}
        icon="arrow-right-bold-circle"
        mode="contained"
        buttonColor="orange"
        loading={loading}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
        // accessoryLeft={loading ? LoadingIndicator : SaveIcon}
      >
        Update
      </Button>
    ),
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      const url = "load-video-promotion";
      const data = { agent_id: agentId, tourId: tourid };
      const result = await axiosPost(url, data);
      if (result.data[0].response.status == "success") {
        const agObj = result.data[0].response.data;
        reset(result.data[0].response.data);
        // for (const [key, value] of Object.entries(agObj)) {
        //   let val = "";
        //   if (!`${value}` || `${value}` !== "null") {
        //     val = `${value}`;
        //   }

        //   setValue(`${key}`, val);
        // }
      }
    };
    fetchData();
  }, []);
  return (
    <SafeAreaView>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />

      <Layout style={styles.container}>
        <View style={styles.headingWrap}>
          <FontAwesomeIcon icon={faUser} size={20} color={"#adadad"} />
          <Text category="h6" status="warning" style={styles.pageHeading}>
            Video Promotion
          </Text>
        </View>
        <TabBar
          style={{
            paddingVertical: 15,
            backgroundColor: "#fff",
            elevation: 2,
          }}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <Tab title="Youtube" icon={CameraIcon} />
          <Tab title="Truveo" icon={AddressIcon} />
          <Tab title="Podcast" icon={GalleryIcon} />
        </TabBar>
        <ViewPager
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <YoutubeTab />
          <TruveoTab />
          <PodCastTab />
        </ViewPager>
      </Layout>
    </SafeAreaView>
  );
};

export default VideoPromotion;

const styles = StyleSheet.create({
  selectTag: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    margin: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  container: {
    paddingBottom: 100,
    height: Dimensions.get("window").height,
  },
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  sectionHead: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  uploadImages: {
    // justifyContent: "center",
    // alignItems: "center",
    // height: 500,
  },
  imageWrap: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  formWrapTab: {
    padding: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    margin: 15,
    borderRadius: 15,
  },
  formWrapCard: {
    backgroundColor: "#ffffff",
    // elevation: 10,

    padding: 10,
  },
  formControl: {
    margin: 5,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  saveButton: {
    margin: 10,
    alignSelf: "center",
  },
  activeLabels: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  borderedText: {
    backgroundColor: "#e5e5e5",
    padding: 8,
    marginBottom: 20,
    elevation: 1,
    borderRadius: 5,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
});
