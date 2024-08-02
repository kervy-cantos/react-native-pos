import { create } from 'zustand';
import { app } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

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
					reject(error); // Reject the promise with the error
				},
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					console.log('File available at', downloadURL);
					resolve(downloadURL); // Resolve the promise with the download URL
				}
			);
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error; // Re-throw the error to handle it elsewhere
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
		try {
			const docRef = await addDoc(collection(db, 'Categories'), category);
			console.log('Category added with ID:', docRef.id);
			// Optionally, refetch categories to update the store
			const data = await getDocs(collection(db, 'Categories'));
			set({ data: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
		} catch (error) {
			console.error('Error adding category:', error);
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
			console.error('Error adding product:', error);
		}

		set({ loading: false });
	},
	setProductDetails: id => {
		set(state => ({ selectedProduct: state.data.find(product => product.id === id) }));
	},

	addProduct: async product => {
		set({ loading: true });

		try {
			const uniqueId = uuidv4();
			const imageUrl = await uploadImage(product.image, uniqueId);
			const docRef = await addDoc(collection(db, 'Inventory'), { ...product, image: imageUrl });
			console.log('Product added with ID:', docRef.id);
			// Optionally, refetch products to update the store
			const data = await getDocs(collection(db, 'Inventory'));
			set({ data: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
		} catch (error) {
			console.error('Error adding product:', error);
		}
		set({ loading: false });
	}
}));
