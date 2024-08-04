import { useState, useEffect } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { COLORS, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn, Welcome } from '../components';
import { Icon } from '@rneui/themed';
import NetInfo from '@react-native-community/netinfo';
import { syncData } from '../utils/syncUtils';
import { useCartStore } from '../hooks/zustand/store';
import Slider from '../components/common/slideToConfirm/slider';
export default function Index() {
	const [totalItems, setTotalItems] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);
	const [sliderState, setSliderState] = useState(false);
	const router = useRouter();
	const { data: cart } = useCartStore(state => state);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			if (state.isConnected) {
				syncData();
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		let t = 0;
		let p = 0;
		cart.forEach(item => {
			t += item.quantity;
		});
		cart.forEach(item => {
			p += item.quantity * item.price;
		});
		setTotalPrice(p);
		setTotalItems(t);
	}, [JSON.stringify(cart)]);

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

			{cart.length > 0 && (
				<View style={styles.total}>
					<View>
						<Slider
							totalItems={totalItems}
							totalPrice={'₱' + ' ' + totalPrice}
							sliderState={sliderState}
							setSliderState={setSliderState}
						/>
					</View>
				</View>
			)}
			<View style={styles.footer}>
				<Text style={styles.footerText}>CopyRight 2024</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	total: {
		position: 'absolute',
		bottom: 50,
		width: '100%',
		height: 80,
		backgroundColor: COLORS.secondary,
		opacity: 0.8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	totalText: {
		color: 'white',
		fontSize: 16
	},
	footer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: 60,
		backgroundColor: COLORS.tertiary,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footerText: {
		color: COLORS.lightWhite,
		fontSize: SIZES.font
	}
});
