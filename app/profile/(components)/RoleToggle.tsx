interface RoleToggleProps {
    selectedRole: "child" | "parent";
    onRoleChange: (role: "child" | "parent") => void;
}

export default function RoleToggle({
    selectedRole,
    onRoleChange,
}: RoleToggleProps) {
    return (
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl">
            <button
                onClick={() => onRoleChange("child")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedRole === "child"
                        ? "bg-white text-black shadow-sm"
                        : "text-black"
                }`}
            >
                Ребенок
            </button>
            <button
                onClick={() => onRoleChange("parent")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedRole === "parent"
                        ? "bg-white text-black shadow-sm"
                        : "text-black"
                }`}
            >
                Родитель
            </button>
        </div>
    );
}

