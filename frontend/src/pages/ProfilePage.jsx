import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileForm from "../components/common/ProfileForm";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/user/profile");
      setProfile(res.data);
    } catch (err) {
      toast.error("Gagal memuat profil.");
    }
    setLoading(false);
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await axios.patch("/api/user/profile", data);
      toast.success("Profil berhasil diperbarui!");
      fetchProfile();
    } catch (err) {
      toast.error("Gagal memperbarui profil.");
    }
    setLoading(false);
  };

  const handleChangePassword = async (data) => {
    setLoading(true);
    try {
      await axios.patch("/api/user/profile", { password: data.passwordBaru });
      toast.success("Password berhasil diubah!");
    } catch (err) {
      toast.error("Gagal mengubah password.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
      {profile && (
        <ProfileForm
          profile={profile}
          onUpdate={handleUpdate}
          onChangePassword={handleChangePassword}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProfilePage;
