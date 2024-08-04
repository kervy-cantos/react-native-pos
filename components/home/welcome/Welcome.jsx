import { useState } from 'react';
import { View, Text, TextInput, Image, FlatList, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './welcome.style';
import { COLORS, FONT, icons, SIZES } from '../../../constants';
import { useEffect, useMemo } from 'react';
import ProductCard from '../../common/cards/popular/PopularJobCard';
import { useCartStore, useCategoriesStore, useProductsStore } from '../../../hooks/zustand/store';

const Welcome = () => {
	const router = useRouter();

	const [activeTab, setActiveTab] = useState({ id: '', name: 'All' });
	const [searchValue, setSearchValue] = useState('');
	const [tabs, setTabs] = useState([]);

	const { fetchCategories, data: productTypes, loading: categoriesLoading } = useCategoriesStore(state => state);
	const { data: categoryData, fetchProducts, loading: productsLoading } = useProductsStore(state => state);

	useEffect(() => {
		fetchCategories();
		fetchProducts();
	}, []);

	useEffect(() => {
		setTabs([{ id: '', name: 'All' }, ...productTypes]);
	}, [JSON.stringify(productTypes)]);

	const productsPerCategory = useMemo(() => {
		if (!searchValue) {
			if (activeTab.id == '') return categoryData;
			return categoryData.filter(product => product.categoryId === activeTab.id);
		} else {
			return categoryData.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));
		}
	}, [activeTab, productTypes, categoryData, searchValue]);

	return (
		<ScrollView keyboardShouldPersistTaps='handled'>
			<View style={styles.container}>
				<Pressable
					style={[styles.button, styles.buttonAdd]}
					onPress={() => {
						{
							productTypes.length === 0
								? Alert.alert('Error', 'Please add a category first')
								: router.push('/AddProduct');
						}
					}}>
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
						onChangeText={text => setSearchValue(text)}
						placeholder='What are you looking for'
					/>
				</View>
				<Pressable style={styles.searchBtn} onPress={() => {}}>
					<Image source={icons.search} resizeMode='contain' style={styles.searchBtnImage} />
				</Pressable>
			</View>
			<View style={styles.tabsContainer}>
				{categoriesLoading || productsLoading ? (
					<ActivityIndicator size='large' color='black' />
				) : (
					<FlatList
						horizontal
						data={tabs}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => (
							<Pressable
								style={styles.tab(activeTab, item)}
								onPress={() => {
									setActiveTab(item);
								}}>
								{item?.name === 'All' ? (
									<Text style={{ color: activeTab.id == '' ? COLORS.secondary : COLORS.gray2 }}>
										{item?.name}
									</Text>
								) : (
									<Text style={styles.tabText(activeTab, item)}>{item?.name}</Text>
								)}
							</Pressable>
						)}
					/>
				)}
			</View>
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					padding: SIZES.medium
				}}>
				{productsPerCategory.length != 0 &&
					productsPerCategory.map(product => (
						<View
							key={product.id}
							style={{
								width: '50%' // Ensures each item takes up 50% of the container width, 2 items per row
							}}>
							<ProductCard food={product} />
						</View>
					))}
			</View>
		</ScrollView>
	);
};

export default Welcome;
