export const API_BASE_URL = "http://localhost:3000";

//Products
export const SEARCH_PRODUCTS_API = `${API_BASE_URL}/products/search-products`;
export const GET_BROWSE_PRODUCT_API = `${API_BASE_URL}/products/get-browse-product`;

//Categories
export const GET_CATEGORIES_FOR_SIDEBAR_API = `${API_BASE_URL}/categories/get-categories-for-sidebar`;
export const GET_MAIN_CATEGORIES_API = `${API_BASE_URL}/categories/get-main-categories`;
export const GET_CATEGORIES_FOR_MENU_API = `${API_BASE_URL}/categories/get-categories-for-menu`;


//Home
export const GET_TOP_5_ENDING_SOON_API = `${API_BASE_URL}/home/top-5-ending-soon`;
export const GET_TOP_5_MOST_BIDS_API = `${API_BASE_URL}/home/top-5-most-bids`;
export const GET_TOP_5_HIGHEST_PRICE_API = `${API_BASE_URL}/home/top-5-highest-price`;

//Users
export const REGISTER_API = `${API_BASE_URL}/users/register`;
export const LOGIN_API = `${API_BASE_URL}/users/login`;
export const VERIFY_OTP_API = `${API_BASE_URL}/users/verify-otp`;
export const RESEND_OTP_API = `${API_BASE_URL}/users/resend-otp`;