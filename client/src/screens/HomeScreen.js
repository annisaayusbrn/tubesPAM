import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Button,
  Alert,
} from 'react-native';
import { Card } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNews } from '../store/actions/newsAction';
import { addBookmark } from '../store/actions/bookmarkAction';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { news } = useSelector((state) => state.news);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const listNews = async () => {
      await dispatch(getNews());
    };
    listNews();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getNews());
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);

  const handleAddBookmark = async (news_id) => {
    try {
      const user_id = user.id;
      const res = await dispatch(addBookmark({ user_id, news_id }));
      if (res.error) {
        return Alert.alert('Error', res.message);
      } else {
        return Alert.alert('Success', res.message, [
          {
            text: 'OK',
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 30 }}>Berita</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {news && news.length > 0 ? (
            news.map((data) => {
              return (
                <Card key={data.id}>
                  <Card.Title>{data.title}</Card.Title>
                  <Card.Image source={{ uri: data.image }} />
                  <Text style={{ marginTop: 10, textAlign: 'justify' }}>
                    {data.body}
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <Button
                      onPress={() => handleAddBookmark(data.id)}
                      title="Tambah Bookmark"
                    ></Button>
                  </View>
                </Card>
              );
            })
          ) : (
            <View style={{ margin: 20 }}>
              <Text>Berita tidak ada</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
