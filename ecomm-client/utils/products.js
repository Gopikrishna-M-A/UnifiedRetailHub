import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const getProducts = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/products`);
        const products = response.data;
        return products;
    } catch (error) {
        console.log(error);
    }
}

export const getProduct = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/products/${id}`);
        const product = response.data;
        return product;
    } catch (error) {
        console.log(error);
    }
}

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/categories`);
        const categories = response.data;
        return categories;
    } catch (error) {
        console.log(error);
    }
}


export const getUniqueCategories = async () => {
    const categories = await getAllCategories();

    const uniqueCategoriesSet = new Set();
    const uniqueCategories = categories.filter(category => {
      const key = `${category._id}-${category.name}-${category.description}`;
      return !uniqueCategoriesSet.has(key) && uniqueCategoriesSet.add(key);
    });

    return uniqueCategories;
}


