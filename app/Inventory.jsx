import { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { COLORS, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn } from '../components';
import { useCategoriesStore } from '../hooks/zustand/store';
import CategoryCard from '../components/common/cards/categories/CategoriesCard';

export default function Inventory() {
	const router = useRouter();

	const { data: categories } = useCategoriesStore(state => state);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: {
						backgroundColor: COLORS.secondary,
						borderBottomWidth: 1,
						borderBottomColor: 'black'
					},
					headerTitle: '',
					headerTintColor: COLORS.lightWhite,
					headerShadowVisible: true,

					headerRight: () => <ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View
					style={{
						flex: 1,
						padding: SIZES.medium
					}}>
					<View style={styles.inventoryHeader}>
						<Text style={styles.headerStyle}>Inventory</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						flexWrap: 'wrap',
						padding: SIZES.medium
					}}>
					{categories.length != 0 &&
						categories.map(cat => (
							<View
								key={cat.id}
								style={{
									width: '50%' // Ensures each item takes up 50% of the container width, 2 items per row
								}}>
								<CategoryCard categoryName={cat} />
							</View>
						))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	inventoryHeader: {
		flexDirection: 'row',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.secondary,
		padding: SIZES.medium
	},
	headerStyle: {
		color: COLORS.lightWhite,
		fontSize: SIZES.large
	}
});
