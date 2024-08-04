import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../../constants';
import { useCartStore, useProductsStore } from '../../../../hooks/zustand/store';

const CategoryCard = ({ categoryName }) => {
	const router = useRouter();
	const { addToCart, data: cart, reduceQuantity, removeFromCart } = useCartStore(state => state);
	const { setProductDetails } = useProductsStore(state => state);

	const handleCardPress = id => {
		setProductDetails(id);
		router.push(`/ProductDetails/${id}`);
	};

	return (
		<View>
			<Pressable
				style={({ pressed }) => [
					{
						transform: [{ scale: pressed ? 0.96 : 1 }]
					},
					localStyles.cardContainer
				]}>
				<Card containerStyle={{ ...localStyles.card }}>
					<Text>{categoryName.name}</Text>
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

export default CategoryCard;
