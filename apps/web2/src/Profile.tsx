import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

export default function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const accessToken = localStorage.getItem("access_token");
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth.access_token;
        if (!accessToken) {
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

                if (res.status !== 200 || !data.status) {
                    logout(); // invalid token
                    return;
                }

                const apiUser = data.data;

                const formattedUser = {
                    fullName: apiUser.FullName,
                    email: apiUser.email,
                    mobile: apiUser.mobile_number,
                    uid: apiUser.Uid,
                };

                // localStorage.setItem("user", JSON.stringify(formattedUser));
                setUser(formattedUser);

            } catch (err) {
                console.error(err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // ✅ Clean Logout
    const logout = async () => {
        // const accessToken = localStorage.getItem("access_token");
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth.access_token;
        try {
            if (accessToken) {
                await fetch(
                    `${import.meta.env.VITE_BACKENDURL}/api/invalidateAccessToken`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            }
        } catch (err) {
            console.error("Logout API failed:", err);
        }

        // ✅ Clear everything AFTER API call
        localStorage.removeItem("user");

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
                <h2>Hi {user?.fullName || "User"} 👋</h2>

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

                <button className="primary logout" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}