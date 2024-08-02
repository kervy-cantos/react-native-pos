import { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { ScreenHeaderBtn } from '../../components';
import { COLORS, SIZES, images } from '../../constants';
import { useProductsStore } from '../../hooks/zustand/store';
import { Icon } from '@rneui/themed';

export default function ProductDetails() {
	const router = useRouter();
	const [count, setCount] = useState(1);
	const { selectedProduct } = useProductsStore(state => state);
	!selectedProduct && router.push('/');

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: {
						backgroundColor: COLORS.lightWhite
					},
					headerShadowVisible: false,
					headerTitle: 'Product Details',

					headerRight: () => <ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View
					style={{
						flex: 1,
						padding: SIZES.medium
					}}>
					{selectedProduct && <Image source={{ uri: selectedProduct?.image }} style={localStyles.image} />}
					<Text style={{ fontSize: 34, fontWeight: 'bold' }}>{selectedProduct?.name}</Text>
					<Text style={{ fontSize: 30, marginTop: 10 }}>{selectedProduct?.description}</Text>
					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
						<Text style={{ fontSize: 30, fontWeight: 'bold' }}>
							Price: <Icon type='material-community' name='currency-php' size={16} />
							&nbsp;
						</Text>
						<Text style={{ fontSize: 30 }}>
							{selectedProduct?.price} x {count}
						</Text>
					</View>
					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
						<Text style={{ fontSize: 30, fontWeight: 'bold' }}>SubTotal: </Text>
						<Text style={{ fontSize: 30 }}>{selectedProduct?.price * count}</Text>
					</View>
					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
						<Text style={{ fontSize: 30, fontWeight: 'bold' }}>Total: </Text>
						<Text style={{ fontSize: 30 }}>{selectedProduct?.price * count}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const localStyles = StyleSheet.create({
	card: {
		minHeight: 125,
		borderColor: '#FF7754', // Orange border color
		borderWidth: 2, // Border width
		borderRadius: 15,
		padding: 10,
		shadowColor: '#FF7754', // Warm orange shadow
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 8,
		elevation: 5
	},
	productName: {
		fontSize: 14,
		marginTop: 5,
		fontWeight: 'bold'
	},
	image: {
		width: '100%',
		height: 250,
		borderRadius: 10
	}
});
