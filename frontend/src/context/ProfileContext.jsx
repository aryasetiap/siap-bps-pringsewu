import React, { createContext, useState, useContext, useEffect } from "react";
import * as userService from "../services/userService";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userService.getProfile();
      setProfileData(response.data);

      // Simpan foto di localStorage untuk quick access
      if (response.data.foto) {
        localStorage.setItem("userPhoto", response.data.foto);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePhoto = async (formData) => {
    setLoading(true);
    try {
      const response = await userService.updateProfilePhoto(formData);
      setProfileData(response.data);

      // Update foto di localStorage
      if (response.data.foto) {
        localStorage.setItem("userPhoto", response.data.foto);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile: profileData,
        loading,
        fetchProfile,
        updateProfilePhoto,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
