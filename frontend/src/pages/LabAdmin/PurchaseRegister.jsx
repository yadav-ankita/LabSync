import React, { useEffect, useState } from "react";
import {
    Plus,
    Eye,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

import { TopBar } from "./TopBar";
import { useAdminContext } from "../../context/AdminContext";

const Detail = ({ label, value }) => {
    return (
        <div>
            <p
                className="text-xs mb-1"
                style={{ color: "#5B6A5F" }}
            >
                {label}
            </p>

            <div
                className="border rounded-lg px-3 py-2 text-sm"
                style={{
                    borderColor: "#E3E6DF",
                    color: "#1F2A24"
                }}
            >
                {value}
            </div>
        </div>
    );
};

export function PurchaseRegister() {
    const {
        purchases,
        getPurchases,
        getPurchase,
        addPurchase
    } = useAdminContext();
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState(null);
    const [form, setForm] = useState({
        date: "",
        particulars: "",
        supplierName: "",
        billNumber: "",
        billDate: "",
        quantity: "",
        unitCost: "",
        totalCost: "",
        salesTax: "",
        freight: "",
        grandTotal: "",
        signature: "",
        remarks: ""
    });
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [loadingPurchase, setLoadingPurchase] = useState(false);
    const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);

    // --------------------------------------------------
    // Fetch Purchase Register
    // --------------------------------------------------

    useEffect(() => {

        const loadPurchases = async () => {

            setLoading(true);

            await getPurchases();

            setLoading(false);
        };

        loadPurchases();

    }, []);


    // --------------------------------------------------
    // Handle form input
    // --------------------------------------------------

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // --------------------------------------------------
    // Record Purchase
    // --------------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);
        setFormMessage(null);

        const result = await addPurchase({

            date: form.date,

            particulars: form.particulars.trim(),

            supplierName: form.supplierName.trim(),

            billNumber: form.billNumber.trim(),

            billDate: form.billDate,

            quantity: Number(form.quantity),

            unitCost: Number(form.unitCost),

            totalCost: Number(form.totalCost),

            salesTax: Number(form.salesTax || 0),

            freight: Number(form.freight || 0),

            grandTotal: Number(form.grandTotal),

            signature: form.signature.trim(),

            remarks: form.remarks.trim()
        });


        setSubmitting(false);


        if (result.success) {

            setForm({

                date: "",
                particulars: "",
                supplierName: "",
                billNumber: "",
                billDate: "",
                quantity: "",
                unitCost: "",
                totalCost: "",
                salesTax: "",
                freight: "",
                grandTotal: "",
                signature: "",
                remarks: ""
            });


            setFormMessage({
                type: "success",
                text: "Purchase recorded successfully."
            });


            setTimeout(() => {

                setShowForm(false);
                setFormMessage(null);

            }, 1500);

        } else {

            setFormMessage({
                type: "error",
                text: result.message
            });
        }
    };
    // view each purchase
    const handleViewPurchase = async (id) => {
    setLoadingPurchase(true);

    const result = await getPurchase(id);

    setLoadingPurchase(false);

    if (result.success) {
        setSelectedPurchase(result.purchase);
        setShowPurchaseDetails(true);
    }
};

    return (

        <div>

            {/* --------------------------------------------- */}
            {/* TOP BAR */}
            {/* --------------------------------------------- */}

            <TopBar
                title="Purchase Register"
                subtitle="View and manage the complete history of department purchases."
            />


            {/* --------------------------------------------- */}
            {/* RECORD PURCHASE BUTTON */}
            {/* --------------------------------------------- */}

            {!showForm && (

                <div className="flex justify-end mb-4">

                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{
                            backgroundColor: "#1F2A24"
                        }}
                    >

                        <Plus size={15} />

                        Record Purchase

                    </button>

                </div>
            )}


            {/* --------------------------------------------- */}
            {/* RECORD PURCHASE FORM */}
            {/* --------------------------------------------- */}

            {showForm && (

                <div
                    className="bg-white rounded-xl border p-5 mb-4"
                    style={{
                        borderColor: "#E3E6DF"
                    }}
                >

                    {/* Form Header */}

                    <div className="flex justify-between items-center mb-5">

                        <div>

                            <h2
                                className="text-base font-semibold"
                                style={{
                                    color: "#1F2A24"
                                }}
                            >
                                Record Purchase
                            </h2>

                            <p
                                className="text-xs mt-1"
                                style={{
                                    color: "#5B6A5F"
                                }}
                            >
                                Enter the purchase details for the Purchase Register.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setFormMessage(null);
                            }}
                            className="p-1.5 rounded-lg"
                            style={{
                                color: "#5B6A5F"
                            }}
                        >

                            <X size={18} />

                        </button>

                    </div>


                    {/* Purchase Form */}

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-3 gap-4">


                            {/* Date */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Date *

                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Particulars */}

                            <div className="col-span-2">

                                <label className="block text-xs mb-1">

                                    Particulars *

                                </label>

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


                            {/* Supplier */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Name of Supplier *

                                </label>

                                <input
                                    type="text"
                                    name="supplierName"
                                    required
                                    value={form.supplierName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Bill Number */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Bill Number *

                                </label>

                                <input
                                    type="text"
                                    name="billNumber"
                                    required
                                    value={form.billNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Bill Date */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Bill Date *

                                </label>

                                <input
                                    type="date"
                                    name="billDate"
                                    required
                                    value={form.billDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Quantity */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Quantity *

                                </label>

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


                            {/* Unit Cost */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Unit Cost *

                                </label>

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


                            {/* Total Cost */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Total Cost *

                                </label>

                                <input
                                    type="number"
                                    name="totalCost"
                                    min="0"
                                    required
                                    value={form.totalCost}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Sales Tax */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Sales Tax / Ex. Duty

                                </label>

                                <input
                                    type="number"
                                    name="salesTax"
                                    min="0"
                                    value={form.salesTax}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Freight */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Freight

                                </label>

                                <input
                                    type="number"
                                    name="freight"
                                    min="0"
                                    value={form.freight}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Grand Total */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Grand Total *

                                </label>

                                <input
                                    type="number"
                                    name="grandTotal"
                                    min="0"
                                    required
                                    value={form.grandTotal}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Signature */}

                            <div>

                                <label className="block text-xs mb-1">

                                    Signature

                                </label>

                                <input
                                    type="text"
                                    name="signature"
                                    value={form.signature}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>


                            {/* Remarks */}

                            <div className="col-span-2">

                                <label className="block text-xs mb-1">

                                    Remarks

                                </label>

                                <input
                                    type="text"
                                    name="remarks"
                                    value={form.remarks}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border text-sm"
                                />

                            </div>

                        </div>


                        {/* Message */}

                        {formMessage && (

                            <div
                                className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
                                style={{
                                    backgroundColor:
                                        formMessage.type === "success"
                                            ? "#E3EEE5"
                                            : "#FBEAEA",

                                    color:
                                        formMessage.type === "success"
                                            ? "#2F6F52"
                                            : "#B3261E"
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


                        {/* Submit */}

                        <div className="flex justify-end mt-5">

                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                                style={{
                                    backgroundColor: "#1F2A24"
                                }}
                            >

                                <Plus size={15} />

                                {submitting
                                    ? "Recording..."
                                    : "Record Purchase"}

                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* --------------------------------------------- */}
            {/* PURCHASE REGISTER */}
            {/* --------------------------------------------- */}

            {loading ? (

                <div
                    className="bg-white rounded-xl border p-8 text-center text-sm"
                    style={{
                        borderColor: "#E3E6DF",
                        color: "#5B6A5F"
                    }}
                >

                    Loading purchase register...

                </div>

            ) : purchases.length === 0 ? (

                <div
                    className="bg-white rounded-xl border p-8 text-center text-sm"
                    style={{
                        borderColor: "#E3E6DF",
                        color: "#5B6A5F"
                    }}
                >

                    No purchase records found.

                </div>

            ) : (

                <div
                    className="bg-white rounded-xl border overflow-hidden"
                    style={{
                        borderColor: "#E3E6DF"
                    }}
                >

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr
                                    style={{
                                        backgroundColor: "#F5F7F3",
                                        color: "#1F2A24"
                                    }}
                                >

                                    <th className="text-left px-4 py-3 font-semibold">
                                        Date
                                    </th>

                                    <th className="text-left px-4 py-3 font-semibold">
                                        Particulars
                                    </th>

                                    <th className="text-left px-4 py-3 font-semibold">
                                        Supplier
                                    </th>

                                    <th className="text-left px-4 py-3 font-semibold">
                                        Bill No.
                                    </th>

                                    <th className="text-left px-4 py-3 font-semibold">
                                        Quantity
                                    </th>

                                    <th className="text-left px-4 py-3 font-semibold">
                                        Grand Total
                                    </th>

                                    <th className="text-center px-4 py-3 font-semibold">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {purchases.map((purchase) => (

                                    <tr
                                        key={purchase._id}
                                        className="border-t"
                                        style={{
                                            borderColor: "#E3E6DF"
                                        }}
                                    >

                                        <td className="px-4 py-3">

                                            {new Date(
                                                purchase.date
                                            ).toLocaleDateString("en-IN")}

                                        </td>


                                        <td className="px-4 py-3">

                                            {purchase.particulars}

                                        </td>


                                        <td className="px-4 py-3">

                                            {purchase.supplierName}

                                        </td>


                                        <td className="px-4 py-3">

                                            {purchase.billNumber}

                                        </td>


                                        <td className="px-4 py-3">

                                            {purchase.quantity}

                                        </td>


                                        <td className="px-4 py-3 font-medium">

                                            ₹{purchase.grandTotal}

                                        </td>


                                        <td className="px-4 py-3 text-center">

                                            <button
                                                onClick={() => handleViewPurchase(purchase._id)}
                                                disabled={loadingPurchase}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                                                style={{
                                                    backgroundColor: "#E3EEE5",
                                                    color: "#2F6F52"
                                                }}
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
        >

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h2
                        className="text-xl font-semibold"
                        style={{ color: "#1F2A24" }}
                    >
                        Purchase Details
                    </h2>

                    <p
                        className="text-sm mt-1"
                        style={{ color: "#5B6A5F" }}
                    >
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
                >
                    <X size={20} />
                </button>

            </div>


            {/* Details */}
            <div className="grid grid-cols-2 gap-4">

                <Detail
                    label="Purchase Date"
                    value={new Date(
                        selectedPurchase.date
                    ).toLocaleDateString("en-IN")}
                />

                <Detail
                    label="Bill Date"
                    value={new Date(
                        selectedPurchase.billDate
                    ).toLocaleDateString("en-IN")}
                />

                <Detail
                    label="Particulars"
                    value={selectedPurchase.particulars}
                />

                <Detail
                    label="Supplier"
                    value={selectedPurchase.supplierName}
                />

                <Detail
                    label="Bill Number"
                    value={selectedPurchase.billNumber}
                />

                <Detail
                    label="Quantity"
                    value={selectedPurchase.quantity}
                />

                <Detail
                    label="Unit Cost"
                    value={`₹${selectedPurchase.unitCost}`}
                />

                <Detail
                    label="Total Cost"
                    value={`₹${selectedPurchase.totalCost}`}
                />

                <Detail
                    label="Sales Tax / Ex. Duty"
                    value={`₹${selectedPurchase.salesTax || 0}`}
                />

                <Detail
                    label="Freight"
                    value={`₹${selectedPurchase.freight || 0}`}
                />

                <Detail
                    label="Grand Total"
                    value={`₹${selectedPurchase.grandTotal}`}
                />

                <Detail
                    label="Signature"
                    value={selectedPurchase.signature || "-"}
                />

            </div>


            {/* Remarks */}
            <div className="mt-4">

                <p
                    className="text-xs mb-1"
                    style={{ color: "#5B6A5F" }}
                >
                    Remarks
                </p>

                <div
                    className="border rounded-lg px-3 py-2 text-sm"
                    style={{
                        borderColor: "#E3E6DF",
                        color: "#1F2A24"
                    }}
                >
                    {selectedPurchase.remarks || "-"}
                </div>

            </div>


            {/* Bill */}
            <div className="mt-5">

                <p
                    className="text-xs mb-2"
                    style={{ color: "#5B6A5F" }}
                >
                    Purchase Bill
                </p>

                <div
                    className="border rounded-lg p-4"
                    style={{ borderColor: "#E3E6DF" }}
                >

                    {selectedPurchase.billFile ? (

                        <p className="text-sm">
                            Bill uploaded
                        </p>

                    ) : (

                        <div>

                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm"
                            />

                            <p
                                className="text-xs mt-2"
                                style={{ color: "#7A847D" }}
                            >
                                Bill upload functionality will be implemented
                                later.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* Close */}
            <div className="flex justify-end mt-6">

                <button
                    onClick={() => {
                        setShowPurchaseDetails(false);
                        setSelectedPurchase(null);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{
                        backgroundColor: "#1F2A24"
                    }}
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