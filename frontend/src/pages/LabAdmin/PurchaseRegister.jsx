import React, { useEffect, useState } from "react";
import {
    Plus,
    Eye,
    Pencil,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { useAdminContext } from "../../context/AdminContext";

const CATEGORIES = [
    "Computers",
    "Monitors",
    "CPUs",
    "Keyboards",
    "Mouse",
    "Printers",
    "Projectors",
    "Networking Equipment",
    "Power Backup",
    "Servers",
    "Raspberry Pi Kits",
    "Furniture",
    "Electrical Equipment",
    "Cameras",
    "Software Licenses",
];

const emptyForm = {
    date: "",
    particulars: "",
    category: "",
    supplierName: "",
    billNumber: "",
    billDate: "",
    fundType: "",
    quantity: "",
    unitCost: "",
    totalCost: "",
    salesTax: "",
    freight: "",
    grandTotal: "",
    signature: "",
    remarks: ""
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs mb-1" style={{ color: "#5B6A5F" }}>
            {label}
        </p>
        <div
            className="border rounded-lg px-3 py-2 text-sm"
            style={{ borderColor: "#E3E6DF", color: "#1F2A24" }}
        >
            {value ?? "-"}
        </div>
    </div>
);

export function PurchaseRegister() {
    const {
        purchases,
        getPurchases,
        getPurchase,
        addPurchase,
        updatePurchase,
        fundTypes,
        getFundTypes
    } = useAdminContext();

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState(null);
    const [editingPurchase, setEditingPurchase] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        supplier: "",
        fundType: "",
        category: "",
        fromDate: "",
        toDate: ""
    });
    const [form, setForm] = useState(emptyForm);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [loadingPurchase, setLoadingPurchase] = useState(false);
    const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);

    useEffect(() => {
        const loadPurchases = async () => {
            setLoading(true);
            try {
                await Promise.all([getPurchases(), getFundTypes()]);
            } finally {
                setLoading(false);
            }
        };

        loadPurchases();
        // These context functions are intended to load the initial register once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            const quantity = Number(updated.quantity) || 0;
            const unitCost = Number(updated.unitCost) || 0;
            const salesTax = Number(updated.salesTax) || 0;
            const freight = Number(updated.freight) || 0;
            const totalCost = quantity * unitCost;
            const grandTotal = totalCost + salesTax + freight;

            return {
                ...updated,
                totalCost: totalCost || "",
                grandTotal: grandTotal || ""
            };
        });
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingPurchase(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormMessage(null);

        const purchaseData = {
            date: form.date,
            particulars: form.particulars.trim(),
            category: form.category,
            supplierName: form.supplierName.trim(),
            billNumber: form.billNumber.trim(),
            billDate: form.billDate,
            fundType: form.fundType,
            quantity: Number(form.quantity),
            unitCost: Number(form.unitCost),
            totalCost: Number(form.totalCost),
            salesTax: Number(form.salesTax || 0),
            freight: Number(form.freight || 0),
            grandTotal: Number(form.grandTotal),
            signature: form.signature.trim(),
            remarks: form.remarks.trim()
        };

        let result;
        try {
            result = editingPurchase
                ? await updatePurchase(editingPurchase._id, purchaseData)
                : await addPurchase(purchaseData);
        } catch (error) {
            result = {
                success: false,
                message: error?.message || "Something went wrong while saving the purchase."
            };
        }

        setSubmitting(false);

        if (result?.success) {
            resetForm();
            await getPurchases();
            setFormMessage({
                type: "success",
                text: editingPurchase
                    ? "Purchase updated successfully."
                    : "Purchase recorded successfully."
            });

            setTimeout(() => {
                setShowForm(false);
                setFormMessage(null);
            }, 1500);
        } else {
            setFormMessage({
                type: "error",
                text: result?.message || "Unable to save purchase."
            });
        }
    };

    const handleViewPurchase = async (id) => {
        setLoadingPurchase(true);
        try {
            const result = await getPurchase(id);
            if (result.success) {
                setSelectedPurchase(result.purchase);
                setShowPurchaseDetails(true);
            }
        } finally {
            setLoadingPurchase(false);
        }
    };

    const handleEditPurchase = (purchase) => {
        setEditingPurchase(purchase);
        setForm({
            date: purchase.date
                ? new Date(purchase.date).toISOString().split("T")[0]
                : "",
            particulars: purchase.particulars || "",
            category: purchase.category || "",
            supplierName: purchase.supplierName || "",
            billNumber: purchase.billNumber || "",
            billDate: purchase.billDate
                ? new Date(purchase.billDate).toISOString().split("T")[0]
                : "",
            fundType: purchase.fundType || "",
            quantity: purchase.quantity ?? "",
            unitCost: purchase.unitCost ?? "",
            totalCost: purchase.totalCost ?? "",
            salesTax: purchase.salesTax ?? "",
            freight: purchase.freight ?? "",
            grandTotal: purchase.grandTotal ?? "",
            signature: purchase.signature || "",
            remarks: purchase.remarks || ""
        });
        setFormMessage(null);
        setShowForm(true);
    };

    const filteredPurchases = purchases.filter((purchase) => {
        const searchText = filters.search.trim().toLowerCase();
        const matchesSearch =
            !searchText ||
            purchase.particulars?.toLowerCase().includes(searchText);

        const matchesSupplier =
            !filters.supplier || purchase.supplierName === filters.supplier;

        const matchesFundType =
            !filters.fundType || purchase.fundType === filters.fundType;

        const matchesCategory =
            !filters.category || (purchase.category || "Uncategorized") === filters.category;

        const purchaseDate = purchase.date
            ? new Date(purchase.date).toISOString().split("T")[0]
            : "";

        const matchesFromDate =
            !filters.fromDate || purchaseDate >= filters.fromDate;

        const matchesToDate =
            !filters.toDate || purchaseDate <= filters.toDate;

        return (
            matchesSearch &&
            matchesSupplier &&
            matchesFundType &&
            matchesCategory &&
            matchesFromDate &&
            matchesToDate
        );
    });

    const clearFilters = () => {
        setFilters({
            search: "",
            supplier: "",
            fundType: "",
            category: "",
            fromDate: "",
            toDate: ""
        });
    };

    return (
        <div>
            <TopBar
                title="Purchase Register"
                subtitle="View and manage the complete history of department purchases."
                rightTop="Lab Administrator"
                rightBottom="Computer Engineering"
            />

            {!showForm && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => {
                            resetForm();
                            setFormMessage(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: "#1F2A24" }}
                    >
                        <Plus size={15} />
                        Record Purchase
                    </button>
                </div>
            )}

            {showForm && (
                <div
                    className="bg-white rounded-xl border p-5 mb-4"
                    style={{ borderColor: "#E3E6DF" }}
                >
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2
                                className="text-base font-semibold"
                                style={{ color: "#1F2A24" }}
                            >
                                {editingPurchase ? "Edit Purchase" : "Record Purchase"}
                            </h2>
                            <p className="text-xs mt-1" style={{ color: "#5B6A5F" }}>
                                Enter the purchase details for the Purchase Register.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                                setFormMessage(null);
                            }}
                            className="p-1.5 rounded-lg"
                            style={{ color: "#5B6A5F" }}
                            aria-label="Close purchase form"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs mb-1">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs mb-1">Particulars *</label>
                                <input
                                    type="text"
                                    name="particulars"
                                    required
                                    value={form.particulars}
                                    onChange={handleChange}
                                    placeholder="e.g. Revolving Chairs"
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Category *</label>
                                <select
                                    name="category"
                                    required
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Name of Supplier *</label>
                                <input
                                    type="text"
                                    name="supplierName"
                                    required
                                    value={form.supplierName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Bill Number *</label>
                                <input
                                    type="text"
                                    name="billNumber"
                                    required
                                    value={form.billNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Bill Date *</label>
                                <input
                                    type="date"
                                    name="billDate"
                                    required
                                    value={form.billDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Type of Fund *</label>
                                <select
                                    name="fundType"
                                    required
                                    value={form.fundType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                >
                                    <option value="">Select Fund</option>
                                    {fundTypes.map((fundType) => (
                                        <option
                                            key={fundType._id || fundType.code}
                                            value={fundType.code}
                                        >
                                            {fundType.code}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Quantity *</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    required
                                    value={form.quantity}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Unit Cost *</label>
                                <input
                                    type="number"
                                    name="unitCost"
                                    min="0"
                                    required
                                    value={form.unitCost}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Total Cost *</label>
                                <input
                                    type="number"
                                    name="totalCost"
                                    value={form.totalCost}
                                    readOnly
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Sales Tax / Ex. Duty</label>
                                <input
                                    type="number"
                                    name="salesTax"
                                    min="0"
                                    value={form.salesTax}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Freight</label>
                                <input
                                    type="number"
                                    name="freight"
                                    min="0"
                                    value={form.freight}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Grand Total *</label>
                                <input
                                    type="number"
                                    name="grandTotal"
                                    value={form.grandTotal}
                                    readOnly
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1">Signature</label>
                                <input
                                    type="text"
                                    name="signature"
                                    value={form.signature}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs mb-1">Remarks</label>
                                <input
                                    type="text"
                                    name="remarks"
                                    value={form.remarks}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />
                            </div>
                        </div>

                        {formMessage && (
                            <div
                                className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
                                style={{
                                    backgroundColor:
                                        formMessage.type === "success" ? "#E3EEE5" : "#FBEAEA",
                                    color: formMessage.type === "success" ? "#2F6F52" : "#B3261E"
                                }}
                            >
                                {formMessage.type === "success" ? (
                                    <CheckCircle2 size={16} />
                                ) : (
                                    <AlertCircle size={16} />
                                )}
                                {formMessage.text}
                            </div>
                        )}

                        <div className="flex justify-end mt-5">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                                style={{ backgroundColor: "#1F2A24" }}
                            >
                                <Plus size={15} />
                                {submitting
                                    ? editingPurchase
                                        ? "Updating..."
                                        : "Recording..."
                                    : editingPurchase
                                        ? "Update Purchase"
                                        : "Record Purchase"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div
                className="bg-white rounded-xl border p-4 mb-4"
                style={{ borderColor: "#E3E6DF" }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs mb-1">Search Particulars</label>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, search: e.target.value }))
                            }
                            placeholder="Search purchase..."
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Supplier</label>
                        <select
                            value={filters.supplier}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, supplier: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                        >
                            <option value="">All Suppliers</option>
                            {[...new Set(purchases.map((purchase) => purchase.supplierName).filter(Boolean))]
                                .sort()
                                .map((supplier) => (
                                    <option key={supplier} value={supplier}>
                                        {supplier}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Fund Type</label>
                        <select
                            value={filters.fundType}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, fundType: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                        >
                            <option value="">All Funds</option>
                            {fundTypes.map((fundType) => (
                                <option
                                    key={fundType._id || fundType.code}
                                    value={fundType.code}
                                >
                                    {fundType.code}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, category: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                            <option value="Uncategorized">Uncategorized (legacy records)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">From Date</label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, fromDate: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-1">To Date</label>
                        <input
                            type="date"
                            value={filters.toDate}
                            min={filters.fromDate || undefined}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, toDate: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-full px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div
                    className="bg-white rounded-xl border p-8 text-center text-sm"
                    style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}
                >
                    Loading purchase register...
                </div>
            ) : purchases.length === 0 ? (
                <div
                    className="bg-white rounded-xl border p-8 text-center text-sm"
                    style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}
                >
                    No purchase records found.
                </div>
            ) : filteredPurchases.length === 0 ? (
                <div
                    className="bg-white rounded-xl border p-8 text-center text-sm"
                    style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}
                >
                    No purchases match the selected filters.
                </div>
            ) : (
                <div
                    className="bg-white rounded-xl border overflow-hidden"
                    style={{ borderColor: "#E3E6DF" }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: "#F5F7F3", color: "#1F2A24" }}>
                                    <th className="text-left px-4 py-3 font-semibold">Date</th>
                                    <th className="text-left px-4 py-3 font-semibold">Particulars</th>
                                    <th className="text-left px-4 py-3 font-semibold">Category</th>
                                    <th className="text-left px-4 py-3 font-semibold">Supplier</th>
                                    <th className="text-left px-4 py-3 font-semibold">Bill No.</th>
                                    <th className="text-left px-4 py-3 font-semibold">Quantity</th>
                                    <th className="text-left px-4 py-3 font-semibold">Grand Total</th>
                                    <th className="text-center px-4 py-3 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPurchases.map((purchase) => (
                                    <tr
                                        key={purchase._id}
                                        className="border-t"
                                        style={{ borderColor: "#E3E6DF" }}
                                    >
                                        <td className="px-4 py-3">
                                            {purchase.date
                                                ? new Date(purchase.date).toLocaleDateString("en-IN")
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3">{purchase.particulars}</td>
                                        <td className="px-4 py-3">
                                            {purchase.category || "Uncategorized"}
                                        </td>
                                        <td className="px-4 py-3">{purchase.supplierName}</td>
                                        <td className="px-4 py-3">{purchase.billNumber}</td>
                                        <td className="px-4 py-3">{purchase.quantity}</td>
                                        <td className="px-4 py-3 font-medium">
                                            ₹{purchase.grandTotal}
                                        </td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleEditPurchase(purchase)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit Purchase"
                                                aria-label="Edit purchase"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleViewPurchase(purchase._id)}
                                                disabled={loadingPurchase}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                                                style={{ backgroundColor: "#E3EEE5", color: "#2F6F52" }}
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showPurchaseDetails && selectedPurchase && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{ color: "#1F2A24" }}
                                >
                                    Purchase Details
                                </h2>
                                <p className="text-sm mt-1" style={{ color: "#5B6A5F" }}>
                                    Complete purchase record
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPurchaseDetails(false);
                                    setSelectedPurchase(null);
                                }}
                                className="p-2 rounded-lg"
                                style={{ color: "#5B6A5F" }}
                                aria-label="Close purchase details"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Detail
                                label="Purchase Date"
                                value={selectedPurchase.date
                                    ? new Date(selectedPurchase.date).toLocaleDateString("en-IN")
                                    : "-"}
                            />
                            <Detail
                                label="Bill Date"
                                value={selectedPurchase.billDate
                                    ? new Date(selectedPurchase.billDate).toLocaleDateString("en-IN")
                                    : "-"}
                            />
                            <Detail label="Particulars" value={selectedPurchase.particulars} />
                            <Detail
                                label="Category"
                                value={selectedPurchase.category || "Uncategorized"}
                            />
                            <Detail label="Supplier" value={selectedPurchase.supplierName} />
                            <Detail label="Bill Number" value={selectedPurchase.billNumber} />
                            <Detail label="Type of Fund" value={selectedPurchase.fundType} />
                            <Detail label="Quantity" value={selectedPurchase.quantity} />
                            <Detail label="Unit Cost" value={`₹${selectedPurchase.unitCost}`} />
                            <Detail label="Total Cost" value={`₹${selectedPurchase.totalCost}`} />
                            <Detail
                                label="Sales Tax / Ex. Duty"
                                value={`₹${selectedPurchase.salesTax || 0}`}
                            />
                            <Detail label="Freight" value={`₹${selectedPurchase.freight || 0}`} />
                            <Detail label="Grand Total" value={`₹${selectedPurchase.grandTotal}`} />
                            <Detail label="Signature" value={selectedPurchase.signature || "-"} />
                        </div>

                        <div className="mt-4">
                            <p className="text-xs mb-1" style={{ color: "#5B6A5F" }}>
                                Remarks
                            </p>
                            <div
                                className="border rounded-lg px-3 py-2 text-sm"
                                style={{ borderColor: "#E3E6DF", color: "#1F2A24" }}
                            >
                                {selectedPurchase.remarks || "-"}
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-xs mb-2" style={{ color: "#5B6A5F" }}>
                                Purchase Bill
                            </p>
                            <div
                                className="border rounded-lg p-4"
                                style={{ borderColor: "#E3E6DF" }}
                            >
                                {selectedPurchase.billFile ? (
                                    <p className="text-sm">Bill uploaded</p>
                                ) : (
                                    <div>
                                        <p className="text-sm">No bill uploaded.</p>
                                        <p className="text-xs mt-2" style={{ color: "#7A847D" }}>
                                            Bill upload functionality will be implemented later.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowPurchaseDetails(false);
                                    setSelectedPurchase(null);
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                                style={{ backgroundColor: "#1F2A24" }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
