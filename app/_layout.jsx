import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
		DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
		DMRegular: require('../assets/fonts/DMSans-Regular.ttf')
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			console.log('Fonts loaded, hiding splash screen');
			await SplashScreen.hideAsync();
		} else {
			console.log('Fonts not yet loaded');
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		console.log('Waiting for fonts to load...');
		return null;
	}

	console.log('Fonts loaded, rendering app');
	return <Stack onLayout={onLayoutRootView} />;
}
