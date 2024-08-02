import { useState } from 'react';
import { View, Text, TextInput, Image, FlatList, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './welcome.style';
import { icons, SIZES } from '../../../constants';
import { useEffect, useMemo } from 'react';
import ProductCard from '../../common/cards/popular/PopularJobCard';
import { useCategoriesStore, useProductsStore } from '../../../hooks/zustand/store';

const Welcome = () => {
	const router = useRouter();

	const [activeTab, setActiveTab] = useState('');
	const [searchValue, setSearchValue] = useState('');

	const fetchCategories = useCategoriesStore(state => state.fetchCategories);
	const { data: categoryData, fetchProducts } = useProductsStore(state => state);
	const productTypes = useCategoriesStore(state => state.data);

	useEffect(() => {
		fetchCategories();
		fetchProducts();
	}, []);

	const productsPerCategory = useMemo(() => {
		if (activeTab === '') return [];
		return categoryData.filter(product => product.categoryId === activeTab.id);
	}, [activeTab]);

	return (
		<ScrollView keyboardShouldPersistTaps='handled'>
			<View style={styles.container}>
				<Pressable style={[styles.button, styles.buttonAdd]} onPress={() => router.push('/AddProduct')}>
					<Text style={styles.textStyle}>Add Product</Text>
				</Pressable>
				<Pressable style={[styles.button, styles.buttonAdd2]} onPress={() => router.push('/AddCategory')}>
					<Text style={styles.textStyle}>Add Category</Text>
				</Pressable>
			</View>
			<View style={styles.searchContainer}>
				<View style={styles.searchWrapper}>
					<TextInput
						style={styles.searchInput}
						value={searchValue}
						onChange={e => setSearchValue(e.target.value)}
						placeholder='What are you looking for'
					/>
				</View>
				<Pressable style={styles.searchBtn} onPress={() => {}}>
					<Image source={icons.search} resizeMode='contain' style={styles.searchBtnImage} />
				</Pressable>
			</View>
			<View style={styles.tabsContainer}>
				<FlatList
					horizontal
					data={productTypes}
					renderItem={({ item }) => (
						<Pressable
							style={styles.tab(activeTab, item)}
							onPress={() => {
								setActiveTab(item);
							}}>
							<Text style={styles.tabText(activeTab, item)}>{item?.name}</Text>
						</Pressable>
					)}
				/>
			</View>
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					padding: SIZES.medium
				}}>
				{activeTab != '' &&
					productsPerCategory.length != 0 &&
					productsPerCategory.map(product => (
						<View
							key={product.id}
							style={{
								width: '50%' // Ensures each item takes up 25% of the container width, 4 items per row
							}}>
							<ProductCard food={product} />
						</View>
					))}
			</View>
		</ScrollView>
	);
};

export default Welcome;
