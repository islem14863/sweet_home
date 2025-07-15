import React from 'react';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
const { width, height } = useWindowDimensions();
import { PropsWithChildren } from 'react';

export default function BackgroundVideo({ children }: PropsWithChildren<{}>) {
  if (Platform.OS === 'web') {
    return (
      <View>
      <video
        src={require('../assets/videos/bgw.mp4')}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    <View style={styles.content}>
    {children}
    </View>
    </View>
    );
  }
  else{
  return (
  <View style={styles.container}>      
    <Video
            source={require('../assets/videos/bg.mp4')}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted
          />
    <View style={styles.content}>
    {children}
    </View>
  </View>
  );}
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: -1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});