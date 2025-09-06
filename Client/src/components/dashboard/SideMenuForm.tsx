import type { FC } from "react";
import { Pencil, Pin, Copy, Share2, Trash2, User, LogOut } from "lucide-react";

interface SidebarProps {
    selectedCount?: number;
    onEdit?: () => void;
    onPin?: () => void;
    onDuplicate?: () => void;
    onShare?: () => void;
    onDelete?: () => void;
    onAccount?: () => void;
    onLogout?: () => void;
}

const SideMenuForm: FC<SidebarProps> = ({
    selectedCount = 0,
    onEdit,
    onPin,
    onDuplicate,
    onShare,
    onDelete,
    onAccount,
    onLogout
}) => {
    const isSingleSelected = selectedCount === 1;
    const hasSelection = selectedCount > 0;

    return (
        <div className="bg-[#4451A4] w-[244px] h-screen flex flex-col justify-between py-6">
            {/* Logo */}
            <div className="flex justify-center mt-4">
                <img src="/sticky-note-white.png" alt="Logo" className="w-20 h-20" />
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center flex-1 mt-10 mb-6 items-center gap-3">
                <button
                    onClick={onEdit}
                    title="Edit note"
                    disabled={!isSingleSelected}
                    className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition
                        ${!isSingleSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <Pencil size={18} /> Edit
                </button>

                {/* Pin dugme aktivno samo ako je nešto selektovano */}
                <button
                    onClick={onPin}
                    title="Pin note"
                    disabled={!hasSelection}
                    className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition
                        ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <Pin size={18} /> Pin
                </button>

                <button
                    onClick={onDuplicate}
                    title="Duplicate note"
                    disabled={!hasSelection}
                    className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition
                        ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <Copy size={18} /> Duplicate
                </button>

                <button
                    onClick={onShare}
                    title="Share note"
                    disabled={!hasSelection}
                    className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition
                        ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <Share2 size={18} /> Share
                </button>

                <button
                    onClick={onDelete}
                    title="Delete note"
                    disabled={!hasSelection}
                    className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition
                        ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <Trash2 size={18} /> Delete
                </button>
            </div>

            {/* Bottom icons */}
            <div className="flex flex-col gap-4 px-4">
                <button
                    title="Account info"
                    onClick={onAccount}
                    className="flex items-center gap-2 text-white hover:opacity-80 transition">
                    <User size={20} /> Account
                </button>
                <button
                    title="Logout"
                    onClick={onLogout}
                    className="flex items-center gap-2 text-white hover:opacity-80 transition">
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};


export default SideMenuForm;
