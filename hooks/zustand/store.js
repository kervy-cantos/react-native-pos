import { create } from 'zustand';
import { app } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const db = getFirestore(app);
const storage = getStorage(app);

const uploadImage = async (image, id) => {
	const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
	const storageRef = ref(storage, `/pos-kervy/${id}${filename}`);

	try {
		const response = await fetch(image.uri);
		const blob = await response.blob();

		const uploadTask = uploadBytesResumable(storageRef, blob, {
			contentType: 'image/jpeg' // Or 'image/png', 'video/mp4', etc.
		});

		return new Promise((resolve, reject) => {
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
				},
				error => {
					console.error('Error uploading file:', error);
					reject(error);
				},
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					console.log('File available at', downloadURL);
					resolve(downloadURL);
				}
			);
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
};

const cacheData = async (key, data) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Error caching data:', error);
	}
};

const getCachedData = async key => {
	try {
		const data = await AsyncStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error('Error getting cached data:', error);
		return null;
	}
};

const syncData = async () => {
	const isConnected = await NetInfo.fetch().then(state => state.isConnected);
	if (isConnected) {
		const cachedCategories = await getCachedData('Categories');
		if (cachedCategories) {
			for (const category of cachedCategories) {
				await addDoc(collection(db, 'Categories'), category);
			}
			await AsyncStorage.removeItem('Categories');
		}

		const cachedProducts = await getCachedData('Products');
		if (cachedProducts) {
			for (const product of cachedProducts) {
				const uniqueId = uuidv4();
				const imageUrl = await uploadImage(product.image, uniqueId);
				await addDoc(collection(db, 'Inventory'), { ...product, image: imageUrl });
			}
			await AsyncStorage.removeItem('Products');
		}
	}
};

export const useCategoriesStore = create(set => ({
	loading: false,
	data: [],
	fetchCategories: async () => {
		set({ loading: true });
		const data = await getDocs(collection(db, 'Categories'));
		set({ data: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
		set({ loading: false });
	},
	addCategory: async category => {
		set({ loading: true });
		const isConnected = await NetInfo.fetch().then(state => state.isConnected);

		if (isConnected) {
			try {
				const docRef = await addDoc(collection(db, 'Categories'), category);
				console.log('Category added with ID:', docRef.id);
				const data = await getDocs(collection(db, 'Categories'));
				set({ data: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
			} catch (error) {
				console.error('Error adding category:', error);
			}
		} else {
			const cachedCategories = (await getCachedData('Categories')) || [];
			cachedCategories.push(category);
			await cacheData('Categories', cachedCategories);
			console.log('Category cached locally');
		}

		set({ loading: false });
	}
}));

export const useProductsStore = create(set => ({
	modal: false,
	loading: false,
	selectedProduct: {},
	data: [],
	setModal: value => set({ modal: value }),
	fetchProducts: async () => {
		set({ loading: true });
		try {
			const data = await getDocs(collection(db, 'Inventory'));
			set({ data: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
		} catch (error) {
			console.error('Error fetching products:', error);
		}

		set({ loading: false });
	},
	setProductDetails: id => {
		set(state => ({ selectedProduct: state.data.find(product => product.id === id) }));
	},
	addProduct: async product => {
		set({ loading: true });
		const isConnected = await NetInfo.fetch().then(state => state.isConnected);

		if (isConnected) {
			try {
				const uniqueId = uuidv4();
				const imageUrl = await uploadImage(product.image, uniqueId);
				const docRef = await addDoc(collection(db, 'Inventory'), { ...product, image: imageUrl });
				console.log('Product added with ID:', docRef.id);
				const data = await getDocs(collection(db, 'Inventory'));
				set({ data: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
			} catch (error) {
				console.error('Error adding product:', error);
			}
		} else {
			const cachedProducts = (await getCachedData('Products')) || [];
			cachedProducts.push(product);
			await cacheData('Products', cachedProducts);
			console.log('Product cached locally');
		}

		set({ loading: false });
	}
}));

export const useCartStore = create(set => ({
	data: [],
	addToCart: product => {
		set(state => {
			const existingProduct = state.data.find(item => item.id === product.id);
			if (existingProduct) {
				existingProduct.quantity += 1;
				return { data: state.data };
			}

			return { data: [...state.data, { ...product, quantity: 1 }] };
		});
	},
	reduceQuantity: id => {
		set(state => {
			const existingProduct = state.data.find(item => item.id === id);
			if (existingProduct.quantity > 1) {
				existingProduct.quantity -= 1;
				return { data: state.data };
			}
			if (existingProduct.quantity === 1) {
				return { data: state.data.filter(item => item.id !== id) };
			}
			return { data: state.data.filter(item => item.id !== id) };
		});
	},

	removeFromCart: id => {
		set(state => ({ data: state.data.filter(item => item.id !== id) }));
	},
	clearCart: () => set({ data: [] })
}));

export const useTransactionStore = create(set => ({
	data: [],
	addTransaction: async transaction => {
		try {
			set(state => ({ data: [...state.data, transaction] }));
			const docRef = await addDoc(collection(db, 'Transactions'), transaction);

			console.log('Transaction added with ID:', docRef.id);
		} catch (error) {
			console.error('Error adding transaction');
			throw new Error('Error adding transaction');
		}
	}
}));

syncData();
