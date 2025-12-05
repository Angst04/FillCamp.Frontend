"use client";

import { useState } from "react";
import { ShoppingBag, Award } from "lucide-react";
import { useTelegram } from "@/context/TelegramProvider";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import ShopHeader from "./(components)/ShopHeader";
import CartButton from "./(components)/CartButton";
import CartItem from "./(components)/CartItem";
import CartSummary from "./(components)/CartSummary";
import { motion, AnimatePresence } from "motion/react";
import { pageVariants, listContainerVariants, slideInFromRight } from "@/lib/animations";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Моковые товары
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Футболка с логотипом",
    description: "Стильная футболка с логотипом лагеря",
    price: 500,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Одежда"
  },
  {
    id: 2,
    name: "Кепка",
    description: "Удобная кепка для защиты от солнца",
    price: 300,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
    category: "Одежда"
  },
  {
    id: 3,
    name: "Набор стикеров",
    description: "Яркие стикеры с персонажами лагеря",
    price: 150,
    image: "https://images.unsplash.com/photo-1618987044463-54d6e9def3ec?w=400&h=400&fit=crop",
    category: "Аксессуары"
  },
  {
    id: 4,
    name: "Термокружка",
    description: "Стильная термокружка 350мл",
    price: 450,
    image: "https://images.unsplash.com/photo-1585847927531-cc2b35033d9c?w=400&h=400&fit=crop",
    category: "Посуда"
  },
  {
    id: 5,
    name: "Рюкзак",
    description: "Вместительный рюкзак для походов",
    price: 800,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Аксессуары"
  },
  {
    id: 6,
    name: "Браслет",
    description: "Яркий силиконовый браслет",
    price: 100,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    category: "Аксессуары"
  }
];

export default function ShopPage() {
  const { webApp } = useTelegram();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [bonusBalance] = useState(1250); // Баланс бонусов пользователя

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    webApp?.HapticFeedback.notificationOccurred("success");
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    webApp?.HapticFeedback.impactOccurred("light");
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === productId) {
              const newQuantity = Math.max(0, item.quantity + delta);
              return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (totalPrice > bonusBalance) {
      webApp?.showAlert("Недостаточно бонусов для оформления заказа!");
      return;
    }

    webApp?.showConfirm(`Оформить заказ на ${totalPrice} бонусов?`, (confirmed: boolean) => {
      if (confirmed) {
        // Здесь будет отправка заказа на backend
        webApp?.showAlert("Заказ оформлен! Скоро с вами свяжутся.");
        setCart([]);
        setShowCart(false);
      }
    });
  };

  if (showCart) {
    return (
      <motion.div
        variants={slideInFromRight}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-2xl mx-auto px-4 py-6 pb-20"
      >
        <div className="flex items-center justify-between mb-6">
          <ShopHeader title="Корзина" description="" />
          <motion.button
            onClick={() => setShowCart(false)}
            className="text-[#0048F2] font-medium hover:text-[#0040d9] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Продолжить покупки
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              </motion.div>
              <p className="text-[#656565]">Корзина пуста</p>
            </motion.div>
          ) : (
            <motion.div key="cart-items">
              <motion.div
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
                className="space-y-4 mb-6"
              >
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    quantity={item.quantity}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </motion.div>

              <CartSummary
                totalItems={totalItems}
                totalPrice={totalPrice}
                bonusBalance={bonusBalance}
                className="mb-4"
              />

              <Button onClick={handleCheckout} disabled={totalPrice > bonusBalance}>
                Оформить заказ
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto px-4 py-6 pb-20 min-h-screen"
    >
      {/* Заголовок и Корзина */}
      <div className="flex items-start justify-between mb-6">
        <ShopHeader title="Магазин 🛍️" description="Обменяй бонусы на призы" />
        <CartButton itemCount={totalItems} onClick={() => setShowCart(true)} />
      </div>

      {/* Баланс */}
      <motion.div
        className="bg-white rounded-[18px] p-4 flex items-center justify-between mb-6 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <Award size={26} className="text-[#ED0000]" />
          </motion.div>
          <span className="font-bold text-[#101010] text-xl">Ваш баланс:</span>
        </div>
        <motion.span
          className="text-[32px] font-bold text-[#ED0000]"
          key={bonusBalance}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {bonusBalance.toLocaleString()}
        </motion.span>
      </motion.div>

      {/* Каталог товаров */}
      <motion.div
        variants={listContainerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-4"
      >
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
