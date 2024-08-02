import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Card, Icon } from '@rneui/themed';

import { useRouter } from 'expo-router';
import { useProductsStore } from '../../../../hooks/zustand/store';

const ProductCard = ({ food }) => {
	const router = useRouter();
	const { setProductDetails } = useProductsStore(state => state);

	const { image } = food;

	const handleCardPress = id => {
		setProductDetails(id);
		router.push(`/ProductDetails/${id}`);
	};

	return (
		<View>
			<Pressable
				style={localStyles.cardContainer}
				onPress={() => {
					handleCardPress(food.id);
				}}>
				<Card containerStyle={localStyles.card}>
					{food.image && <Image source={{ uri: image }} style={localStyles.image} />}
					<Text style={localStyles.productName}>{food.name}</Text>

					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Icon type='material-community' name='currency-php' size={14} />
						<Text>{food.price}</Text>
					</View>
				</Card>
			</Pressable>
		</View>
	);
};

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
		height: 80,
		resizeMode: 'cover'
	},
	cardContainer: {
		width: '100%',
		minHeight: 100,

		borderRadius: 15,
		overflow: 'hidden'
	}
});

export default ProductCard;
