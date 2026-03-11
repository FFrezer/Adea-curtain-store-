"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import jsPDF  from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "@/context/CartContext"; // 
import QRCode from "qrcode";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const generatePDF = async () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("ADE Curtain Store Invoice", 20, 10);

  doc.setFontSize(12);
  doc.text(`Name: ${formData.name}`, 20, 20);
  doc.text(`Phone: ${formData.phone}`, 20, 28);
  doc.text(`Address: ${formData.address}`, 20, 36);

  const startY = 46;
  const cellHeight = 20;
  const imageSize = 12;

  // Table header
autoTable(doc, {
  startY,
  head: [["Image", "Product", "Price", "Qty", "Total"]],
  body: [],
});

let y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 2 : startY + 2;

 for (const item of cart) {
    try {
      const img = await loadImage(item.image);
      doc.addImage(img, "JPEG", 22, y + 2, imageSize, imageSize);
    } catch (err) {
      console.error("Image load failed", err);
    }

    doc.text(item.name, 40, y + 6);
    doc.text(`${item.price} ETB`, 100, y + 6);
    doc.text(`${item.quantity}`, 130, y + 6);
    doc.text(`${item.price * item.quantity} ETB`, 150, y + 6);

    y += cellHeight;
  }

  // Total
  doc.text(`Total: ${total} ETB`, 20, y + 10);

  // Footer contact
  const footerY = y + 30;
  doc.setFontSize(10);
  doc.text("📍 ADE Curtain Store", 20, footerY);
  doc.text("📞 +251 911 234 567", 20, footerY + 6);
  doc.text("🌐 www.adecurtain.com", 20, footerY + 12);

  // QR Code for WhatsApp
  const whatsappURL = `https://wa.me/251911234567?text=Hello`;
  const qrDataUrl = await QRCode.toDataURL(whatsappURL);
  doc.addImage(qrDataUrl, "PNG", 150, footerY, 40, 40);

  // Preview in new tab
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

// Reuse this image loader
const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
   const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = url;
  });
};


  const sendToWhatsApp = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill out all fields");
      return;
    }

    const order = {
      ...formData,
      items: cart,
      total,
    };

    const orderText = `
🧾 New Order:
👤 Name: ${order.name}
📞 Phone: ${order.phone}
📍 Address: ${order.address}

🛒 Items:
${order.items
  .map(
    (item) =>
      `- ${item.name} x${item.quantity} = ${item.price * item.quantity} ETB`
  )
  .join("\n")}

💵 Total: ${order.total} ETB
`;

    const encoded = encodeURIComponent(orderText);
    const whatsappURL = `https://wa.me/251939979708?text=${encoded}`; 

    generatePDF(); // ✅ Preview first
    toast.success("Generating invoice & redirecting to WhatsApp...");

    setTimeout(() => {
      clearCart(); // ✅ empty cart
      window.open(whatsappURL, "_blank");
    }, 1000);
  };

  const changeQty = (id: string, delta: number) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    updateQuantity(id, newQty);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center border rounded-lg p-4 gap-4"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>{item.price} ETB</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => changeQty(item.id, -1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => changeQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-xl">
            Total: {total} ETB
          </div>

          <div className="bg-gray-100 p-4 rounded-md space-y-4">
            <h2 className="text-xl font-semibold">Checkout Info</h2>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded"
              onClick={sendToWhatsApp}
            >
              Send Order via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
