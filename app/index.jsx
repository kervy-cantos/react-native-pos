import { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { COLORS, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn, Welcome } from '../components';
import { Icon } from '@rneui/themed';
export default function Index() {
	const router = useRouter();
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: {
						backgroundColor: COLORS.tertiary,
						height: 50
					},
					headerShadowVisible: false,
					headerTitle: '',
					headerLeft: () => <Icon type='font-awesome' name='gear' color={COLORS.lightWhite} size={26} />,
					headerRight: () => <ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View
					style={{
						flex: 1,
						padding: SIZES.medium
					}}>
					<Welcome />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
