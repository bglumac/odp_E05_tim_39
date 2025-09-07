import { useNavigate } from "react-router-dom";
import AccountInfoForm from "../../components/account_info/AccountInfoForm";
import SideMenuForm from "../../components/dashboard/SideMenuForm";
import { useState } from "react";
import { ObrisiVrednostPoKljucu } from "../../helpers/local_storage";

export default function AccountInfoPage() {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar meni - sve dugmad disabled */}
            <div className="w-64 h-full fixed top-0 left-0">
                <SideMenuForm
                    selectedCount={0}
                    onEdit={() => { }}
                    onPin={() => { }}
                    onDuplicate={() => { }}
                    onShare={() => { }}
                    onDelete={() => { }}
                    onAccount={() => navigate("/account")}
                    onLogout={() => setShowLogoutConfirm(true)}
                />
            </div>


            {showLogoutConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
                        <p className="mb-4 text-lg text-[#4451A4]">
                            Da li ste sigurni da želite da se izlogujete?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    ObrisiVrednostPoKljucu("authToken");
                                    navigate("/login");
                                }}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                            >
                                Da
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Ne
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Glavni deo */}
            <main className="ml-64 flex-1 p-6">
                {/* Header kao običan naslov */}
                <h1 className="text-3xl font-bold text-[#4451A4] mb-8">
                    Account Info
                </h1>

                {/* Forma za prikaz account info */}
                <div className="flex justify-center">
                    <AccountInfoForm />
                </div>
            </main>
        </div>
    );
}
