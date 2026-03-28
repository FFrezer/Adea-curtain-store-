"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const branchPhoneMap: Record<string, string> = {
  MERKATO: "251939979708",
  PIASSA: "251960231547",
  GERJI: "251940707077",
};

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { setOrder } = useCartStore();
  const router = useRouter();
  const pdfRef = useRef<jsPDF | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    branch: "",
    images: [""],
  });

  const branchPhone = useMemo(() => branchPhoneMap[form.branch], [form.branch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm((prev) => ({ ...prev, images: updatedImages }));
  };

  const removeImage = (index: number) => {
    if (form.images.length <= 1) return;
    const filtered = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: filtered }));
  };

  const addImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const validateForm = useCallback(() => {
    const { name, email, address, branch } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !address || !branch || !branchPhone) {
      toast.error("❗ Please fill in all fields and select a valid branch.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("📧 Please enter a valid email address.");
      return false;
    }

    if (cart.length === 0 || total <= 0) {
      toast.error("🛒 Your cart is empty.");
      return false;
    }

    return true;
  }, [form, cart, total, branchPhone]);

  const createPDF = () => {
    const doc = new jsPDF();
    pdfRef.current = doc;

    doc.text("ADE Curtain Store Invoice", 20, 10);
    doc.text(`Name: ${form.name}`, 20, 20);
    doc.text(`Email: ${form.email}`, 20, 30);
    doc.text(`Address: ${form.address}`, 20, 40);

    autoTable(doc,{
      startY: 50,
      head: [["Product", "Price", "Qty", "Total"]],
      body: cart.map((item) => [
        item.name,
        `${item.price} ETB`,
        item.quantity,
        `${item.price * item.quantity} ETB`,
      ]),
    });

    const finalY = doc.lastAutoTable?.finalY || 70;
    doc.text(`Total: ${total} ETB`, 20, finalY + 10);

    return doc;
  };

  const previewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const pdf = createPDF();
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const downloadInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const pdf = createPDF();
    pdf.save("invoice.pdf");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, email, address, branch, images } = form;

    const itemsText = cart
      .map((item) => `• ${item.name} (Qty: ${item.quantity}) - ${item.price} ETB`)
      .join("\n");
    const imagesText = images.filter(Boolean).join("\n");

    const message = encodeURIComponent(
      `🛍️ New Order from ${name}\n\n📧 Email: ${email}\n📍 Address: ${address}\n🏬 Branch: ${branch}\n\n🧾 Items:\n${itemsText}\n\n💰 Total: ${total} ETB` +
        (imagesText ? `\n\n📷 Images:\n${imagesText}` : "")
    );

    const whatsappUrl = `https://wa.me/${branchPhone}?text=${message}`;

    setOrder({
      name,
      phone: branchPhone,
      address,
      delivery: branch,
      items: cart,
      total,
      createdAt: new Date().toISOString(),
      images,
      email,
    });

    toast.success("✅ Order ready to send via WhatsApp!");
    clearCart();
    window.open(whatsappUrl, "_blank");
    router.push("/shop");
  };
return (
  <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
<p className="text-sm text-gray-500">
  ✔ Your order will be sent via WhatsApp to our team  
  ✔ No payment required now  
  ✔ We will contact you to confirm delivery
</p>
    {/* LEFT — FORM */}
    <form onSubmit={handleSubmit} className="space-y-6">

      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Contact Info */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Contact Information</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Address */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Delivery Details</h2>

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select Branch</option>
          {Object.keys(branchPhoneMap).map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Optional References</h2>

        {form.images.map((url, index) => (
          <input
            key={index}
            type="text"
            placeholder="Paste image URL"
            value={url}
            onChange={(e) => handleImageChange(index, e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        ))}

        <button
          type="button"
          onClick={addImage}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add another image
        </button>
      </div>

      {/* CTA */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800"
      >
        Place Order via WhatsApp
      </button>

      {/* Trust Note */}
      <p className="text-xs text-gray-500 text-center">
        ✔ No payment required now — you will confirm via WhatsApp
      </p>
    </form>

    {/* RIGHT — ORDER SUMMARY */}
    <div className="border rounded-xl p-5 h-fit shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">
                  {item.quantity} × {item.price} ETB
                </p>
              </div>
              <p>{item.price * item.quantity} ETB</p>
            </div>
          ))}

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{total} ETB</span>
          </div>
        </div>
      )}

      {/* Extra Actions */}
      <div className="mt-6 space-y-2">
        <button
          onClick={previewInvoice}
          className="w-full py-2 border rounded hover:bg-gray-100"
        >
          Preview Invoice
        </button>

        <button
          onClick={downloadInvoice}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Invoice
        </button>
      </div>
    </div>
  </div>
);
}