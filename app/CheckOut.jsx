import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { ScreenHeaderBtn } from '../components';
import { COLORS, SIZES, images } from '../constants';
import OrderSummary from '../components/checkout/OrderSummary';
import { useCartStore, useTransactionStore } from '../hooks/zustand/store';

const CheckOut = () => {
	const router = useRouter();
	const { data: cart, clearCart } = useCartStore(state => state);
	const { addTransaction } = useTransactionStore(state => state);
	const [change, setChange] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);
	const [cash, setCash] = useState(0);

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

	useEffect(() => {
		const c = cash - totalPrice;
		setChange(c);
	}, [totalPrice, cash]);
	const cancelAlert = () =>
		Alert.alert('Cancel Order? ', 'This action will clear current orders', [
			{
				text: 'Cancel',
				onPress: () => {},
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: () => {
					clearCart();
					setChange(0);
					router.push('/');
				}
			}
		]);
	const printAlert = () =>
		Alert.alert('Confirm Order ', 'Press ok to confirm', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: async () => {
					await handleSaveTransaction();
					clearCart();
					setChange(0);
					router.push('/');
				}
			}
		]);

	const handleSaveTransaction = async () => {
		let dataToSave = {};
		const timeStamp = new Date().toISOString();
		dataToSave['date'] = timeStamp;
		dataToSave['total'] = totalPrice;
		const cartProducts = cart.map(item => item.id);
		dataToSave['products'] = cartProducts;
		dataToSave['change'] = change;
		dataToSave['cash'] = cash;

		try {
			await addTransaction(dataToSave);
			Alert.alert('Success', 'Transaction saved successfully');
		} catch (error) {
			Alert.alert('Error', 'An error occurred while saving the transaction');
		}
	};
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: {
						backgroundColor: COLORS.lightWhite
					},
					headerShadowVisible: false,

					headerRight: () => <ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View
					style={{
						flex: 1,
						padding: SIZES.medium
					}}>
					<OrderSummary change={change} setChange={setChange} cash={cash} setCash={setCash} />
				</View>

				<View flexDirection='row' justifyContent='space-between'>
					<Pressable style={styles.checkoutBtn} onPress={cancelAlert}>
						<Text style={styles.checkoutText}>Cancel Order</Text>
					</Pressable>
					{change >= 0 && (
						<Pressable style={styles.cancelBtn} onPress={printAlert}>
							<Text style={styles.checkoutText}>Print Receipt</Text>
						</Pressable>
					)}
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Text style={styles.footerText}>CopyRight 2024</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
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
	},
	checkoutBtn: {
		backgroundColor: COLORS.secondary,
		padding: 10,
		borderRadius: 5,
		margin: 10
	},
	checkoutText: {
		color: COLORS.lightWhite,
		textAlign: 'center'
	},
	cancelBtn: {
		backgroundColor: COLORS.tertiary,
		padding: 10,
		borderRadius: 5,
		margin: 10
	}
});

export default CheckOut;
