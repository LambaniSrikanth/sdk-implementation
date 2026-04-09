import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

export default function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        console.log("profile token is ", accessToken)
        // ❌ No token → redirect
        if (!accessToken) {
            console.log("No access token found")
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKENDURL}/api/profile`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const data = await res.json();

                // ❌ invalid token
                if (res.status !== 200 || !data.status) {
                    handleLogout();
                    return;
                }

                if (data.status && data.data) {
                    const apiUser = data.data;

                    // ✅ Map API fields → frontend fields
                    const formattedUser = {
                        fullName: apiUser.FullName,
                        email: apiUser.email || apiUser.verifiedEmail,
                        mobile: apiUser.mobile_number,
                        uid: apiUser.Uid,
                    };

                    // ✅ Save in localStorage
                    localStorage.setItem("user", JSON.stringify(formattedUser));

                    // ✅ Set state
                    setUser(formattedUser);
                }
            } catch (err) {
                console.error(err);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // 🔥 Logout
    const handleLogout = () => {
        const accessToken = localStorage.getItem("access_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        const InvalidateToken = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKENDURL}/api/invalidateAccessToken`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const data = await res.json();

                // ❌ invalid token
                if (res.status !== 200 || !data.status) {
                    handleLogout();
                    return;
                }

                if (data.status && data.data) {
                    const apiUser = data.data;

                    // ✅ Map API fields → frontend fields
                    const formattedUser = {
                        fullName: apiUser.FullName,
                        email: apiUser.email || apiUser.verifiedEmail,
                        mobile: apiUser.mobile_number,
                        uid: apiUser.Uid,
                    };

                    // ✅ Save in localStorage
                    localStorage.setItem("user", JSON.stringify(formattedUser));

                    // ✅ Set state
                    setUser(formattedUser);
                }
            } catch (err) {
                console.error(err);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };
        InvalidateToken();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="container">
                <div className="card">
                    <h2>Loading Profile...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                {/* ✅ Welcome Message */}
                <h2>Hi {user?.fullName || "User"} 👋</h2>

                {/* Profile Details */}
                <div className="profile-field">
                    <label>Full Name</label>
                    <p>{user?.fullName || "N/A"}</p>
                </div>

                <div className="profile-field">
                    <label>Email</label>
                    <p>{user?.email || "N/A"}</p>
                </div>

                <div className="profile-field">
                    <label>Mobile</label>
                    <p>{user?.mobile || "N/A"}</p>
                </div>

                {/* Logout */}
                <button className="primary logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}