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

export const GET_WATCHLIST_API = `${API_BASE_URL}/users/watchlists`;
export const ADD_TO_WATCHLIST_API = `${API_BASE_URL}/users/watchlists`;
export const REMOVE_FROM_WATCHLIST_API = `${API_BASE_URL}/users/watchlists`;
export const REMOVE_MANY_FROM_WATCHLIST_API = `${API_BASE_URL}/users/watchlists`;
export const GET_WATCHLIST_ID_API = `${API_BASE_URL}/users/watchlists/ids`;

export const GET_PROFILE_API = `${API_BASE_URL}/users/profile`;
export const UPDATE_PROFILE_API = `${API_BASE_URL}/users/profile`;
export const CHANGE_PASSWORD_API = `${API_BASE_URL}/users/change-password`;

export const GET_RATINGS_SUMMARY_API = `${API_BASE_URL}/users/ratings-summary`;
export const GET_RATINGS_DETAIL_API = `${API_BASE_URL}/users/ratings-detail`;

export const GET_ACTIVE_BIDS_API = `${API_BASE_URL}/users/my-bidding-products`;

export const REQUEST_BECOME_SELLER_API = `${API_BASE_URL}/users/request-upgrade-seller`;
export const GET_SELLER_UPGRADE_STATUS_API = `${API_BASE_URL}/users/upgrade-seller-status`;

export const REFRESH_TOKEN_API = `${API_BASE_URL}/users/refresh-token`;

//Seller
export const CREATE_AUCTION_API = `${API_BASE_URL}/seller/create-auction`;
export const GET_AUTO_EXTEND_CONFIG_API = `${API_BASE_URL}/seller/auto-extend-config`;
export const UPLOAD_IMAGE_API = `${API_BASE_URL}/seller/upload-image`;
