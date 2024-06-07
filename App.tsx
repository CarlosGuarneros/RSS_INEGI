import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { XMLParser } from 'fast-xml-parser';

type NewsItem = {
  title: string;
  description: string;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('https://www.inegi.org.mx/rss/noticias/xmlfeeds?p=4,29')
      .then(response => response.text())
      .then(responseData => {
        const parser = new XMLParser();
        const jsonObj = parser.parse(responseData);
        const items = jsonObj.rss.channel.row;
        const newsArray: NewsItem[] = items.map((row: any) => ({
          title: row.title,
          description: row.description
        }));
        setNews(newsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noticias del INEGI</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#003057" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003057',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  newsItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsDescription: {
    fontSize: 14,
  },
});
