import apiClient from './apiClient';

/**
 * Fetch user profile from API (DummyJSON Users endpoint)
 * Triggers a real GET /users/1 in DevTools Network tab
 */
export const fetchUserProfileApi = async (userId = 1) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.warn('Network user profile fetch notice:', error);
    return null;
  }
};

/**
 * Update user profile details via API (DummyJSON Users endpoint)
 * Triggers a real PUT /users/1 in DevTools Network tab
 */
export const updateUserProfileApi = async (userId = 1, profileData = {}) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.warn('Network user profile update notice:', error);
    return profileData;
  }
};
