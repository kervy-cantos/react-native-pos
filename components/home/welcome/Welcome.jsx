import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import styles from './welcome.style';
import { icons, SIZES } from '../../../constants';

const productTypes = ['All', 'Best-Sellers', 'Drinks', 'Pastries'];

const Welcome = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('All');
	return (
		<View>
			<View style={styles.container}>
				<Text style={styles.userName}>Hello Kervy</Text>
				<Text style={styles.welcomeMessage}>Search a Product</Text>
			</View>
			<View style={styles.searchContainer}>
				<View style={styles.searchWrapper}>
					<TextInput
						style={styles.searchInput}
						value=''
						onChange={() => {}}
						placeholder='What are you looking for'
					/>
				</View>
				<TouchableOpacity style={styles.searchBtn} onPress={() => {}}>
					<Image source={icons.search} resizeMode='contain' style={styles.searchBtnImage} />
				</TouchableOpacity>
			</View>
			<View style={styles.tabsContainer}>
				<FlatList
					horizontal
					data={productTypes}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.tab(activeTab, item)}
							onPress={() => {
								setActiveTab(item);
							}}>
							<Text style={styles.tabText(activeTab, item)}>{item}</Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
};

export default Welcome;
