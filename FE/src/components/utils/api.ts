export const API_BASE_URL = "http://localhost:3000";

//Products
export const SEARCH_PRODUCTS_API = `${API_BASE_URL}/products/search-products`;
export const GET_BROWSE_PRODUCT_API = `${API_BASE_URL}/products/get-browse-product`;
export const GET_PRODUCT_DETAIL_API = (productId: string) =>
  `${API_BASE_URL}/products/${productId}/get-product-detail`;

export const GET_ORDER_DETAIL_API = (orderId: string) =>
  `${API_BASE_URL}/products/orders/${orderId}`;

export const GET_RATING_API = (orderId: string) =>
  `${API_BASE_URL}/products/orders/${orderId}/rating`;

//Categories
export const GET_CATEGORIES_FOR_SIDEBAR_API = `${API_BASE_URL}/categories/get-categories-for-sidebar`;
export const GET_MAIN_CATEGORIES_API = `${API_BASE_URL}/categories/get-main-categories`;
export const GET_CATEGORIES_FOR_MENU_API = `${API_BASE_URL}/categories/get-categories-for-menu`;

//Home
export const GET_TOP_5_ENDING_SOON_API = `${API_BASE_URL}/home/top-5-ending-soon`;
export const GET_TOP_5_MOST_BIDS_API = `${API_BASE_URL}/home/top-5-most-bids`;
export const GET_TOP_5_HIGHEST_PRICE_API = `${API_BASE_URL}/home/top-5-highest-price`;

//Auth
export const REGISTER_API = `${API_BASE_URL}/auth/register`;
export const LOGIN_API = `${API_BASE_URL}/auth/login`;
export const VERIFY_OTP_API = `${API_BASE_URL}/auth/verify-otp`;
export const RESEND_OTP_API = `${API_BASE_URL}/auth/resend-otp`;
export const FORGOT_PASSWORD_API = `${API_BASE_URL}/auth/forgot-password`;
export const VERIFY_FORGOT_PASSWORD_OTP_API = `${API_BASE_URL}/auth/forgot-password/verify-otp`;
export const RESET_FORGOT_PASSWORD_API = `${API_BASE_URL}/auth/forgot-password/reset`;
export const REFRESH_TOKEN_API = `${API_BASE_URL}/auth/refresh-token`;

//Users
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

export const QUESTION_API = `${API_BASE_URL}/users/questions`;
export const BIDDER_REPLY_QUESTION_API = (questionId: string) =>
  `${API_BASE_URL}/users/questions/${questionId}/reply`;

export const PLACE_AUTOBID_API = `${API_BASE_URL}/users/place-autobid`;
export const REQUEST_BIDS_API = `${API_BASE_URL}/users/request-bids`;

export const BUY_NOW_API = `${API_BASE_URL}/users/buy-now`;

export const GET_WON_AUCTIONS_API = `${API_BASE_URL}/users/won-auctions`;

export const ORDER_PAYMENT_API = (orderId: string) =>
  `${API_BASE_URL}/users/orders/${orderId}/payment`;

export const CONFIRM_DELIVERY_API = (orderId: string) =>
  `${API_BASE_URL}/users/orders/${orderId}/confirm-delivery`;

export const RATE_SELLER_API = (orderId: string) =>
  `${API_BASE_URL}/users/orders/${orderId}/rate-seller`;

//Seller
export const CREATE_AUCTION_API = `${API_BASE_URL}/seller/create-auction`;
export const GET_AUTO_EXTEND_CONFIG_API = `${API_BASE_URL}/seller/auto-extend-config`;
export const UPLOAD_IMAGE_API = `${API_BASE_URL}/seller/upload-image`;
export const GET_ACTIVE_LISTINGS_API = `${API_BASE_URL}/seller/listings-active`;
export const APPEND_DESCRIPTION_API = (productId: string) =>
  `${API_BASE_URL}/seller/${productId}/append-description`;

export const GET_ENDED_LISTINGS_API = `${API_BASE_URL}/seller/listings-ended`;

export const SELLER_REPLY_QUESTION_API = (questionId: string) =>
  `${API_BASE_URL}/seller/questions/${questionId}/answer`;

export const GET_BIDDER_REQUESTS_API = (productId: string) =>
  `${API_BASE_URL}/seller/${productId}/bid-requests`;
export const HANDLE_BIDDER_REQUEST_API = (requestId: string) =>
  `${API_BASE_URL}/seller/bid-requests/${requestId}`;

export const GET_ACTIVE_BIDDERS_API = (productId: string) =>
  `${API_BASE_URL}/seller/products/${productId}/active-bidders`;

export const KICK_BIDDER_API = (productId: string, bidderId: string) =>
  `${API_BASE_URL}/seller/products/${productId}/kick-bidder/${bidderId}`;

export const SUBMIT_SHIPMENT_API = (orderId: string) =>
  `${API_BASE_URL}/seller/orders/${orderId}/shipment`;

export const RATE_BUYER_API = (orderId: string) =>
  `${API_BASE_URL}/seller/orders/${orderId}/rate-buyer`;

export const CANCEL_AUCTION_API = (orderId: string) =>
  `${API_BASE_URL}/seller/orders/${orderId}/cancel`;

//Admin
export const CREATE_PARENT_CATEGORY_API = `${API_BASE_URL}/admin/categories/parent`;
export const CREATE_SUB_CATEGORY_API = `${API_BASE_URL}/admin/categories/sub`;

export const UPDATE_PARENT_CATEGORY_API = (categoryId: number) =>
  `${API_BASE_URL}/admin/categories/parent/${categoryId}`;
export const UPDATE_SUB_CATEGORY_API = (categoryId: number) =>
  `${API_BASE_URL}/admin/categories/sub/${categoryId}`;
export const DELETE_PARENT_CATEGORY_API = (categoryId: number) =>
  `${API_BASE_URL}/admin/categories/parent/${categoryId}`;
export const DELETE_SUB_CATEGORY_API = (categoryId: number) =>
  `${API_BASE_URL}/admin/categories/sub/${categoryId}`;

export const GET_PRODUCTS_FOR_ADMIN_API = `${API_BASE_URL}/admin/products`;
export const UPDATE_PRODUCTS_FOR_ADMIN_API = (productId: string) =>
  `${API_BASE_URL}/admin/products/${productId}`;
export const TOGGLE_DELETE_PRODUCTS_FOR_ADMIN_API = (productId: string) =>
  `${API_BASE_URL}/admin/products/${productId}/delete`;

export const GET_USERS_FOR_ADMIN_API = `${API_BASE_URL}/admin/get-users`;

export const APPROVE_SELLER_UPGRADE_API = (id: string) =>
  `${API_BASE_URL}/admin/seller-upgrade-requests/${id}/approve`;
export const REJECT_SELLER_UPGRADE_API = (id: string) =>
  `${API_BASE_URL}/admin/seller-upgrade-requests/${id}/reject`;

export const GET_USER_DETAILS_API = (id: string) =>
  `${API_BASE_URL}/admin/users/${id}`;

export const UPDATE_USER_DETAILS_API = (id: string) =>
  `${API_BASE_URL}/admin/users/${id}`;

export const TOGGLE_BAN_USER_API = (id: string) =>
  `${API_BASE_URL}/admin/users/${id}/ban`;
export const TOGGLE_DELETE_USER_API = (id: string) =>
  `${API_BASE_URL}/admin/users/${id}/delete`;

// Order
export const GET_MESSAGE_ORDER_API = (orderId: string) =>
  `${API_BASE_URL}/orders/${orderId}/messages`;
export const SEND_MESSAGE_ORDER_API = (orderId: string) =>
  `${API_BASE_URL}/orders/${orderId}/messages`;

export const GET_PAYMENT_ORDER_API = (orderId: string) =>
  `${API_BASE_URL}/orders/${orderId}/payment`;

export const GET_SHIPPING_ORDER_API = (orderId: string) =>
  `${API_BASE_URL}/orders/${orderId}/shipping`;
