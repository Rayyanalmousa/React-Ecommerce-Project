export type Page =
  | "home"
  | "products"
  | "cart"
  | "wishlist"
  | "checkout"
  | "confirmation"
  | "style";
export type Product = {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  image: string;
  color: string;
};

export const FREE_SHIPPING_THRESHOLD = 150;

export const products: Product[] = [
  {
    id: 1,
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    description: "A lonely child discovers a hidden garden and the quiet magic of new beginnings.",
    category: "Fiction",
    price: 18,
    color: "#486354",
    image:
      "https://images.unsplash.com/photo-1600818797017-d6e5027210bb?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    title: "A Room of One’s Own",
    author: "Virginia Woolf",
    description: "A thought-provoking classic on creativity, independence, and making space to write.",
    category: "Classics",
    price: 16,
    color: "#8b4d41",
    image:
      "https://images.unsplash.com/photo-1680444257344-e9eb152fb116?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    title: "The Night Circus",
    author: "Erin Morgenstern",
    description: "Step into a mysterious circus where two young magicians compete under the stars.",
    category: "Fantasy",
    price: 22,
    color: "#24323b",
    image:
      "https://images.unsplash.com/photo-1517148892120-4d2da39c8dc1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    title: "The Art of Stillness",
    author: "Pico Iyer",
    description: "A gentle invitation to slow down, look inward, and find calm in a busy world.",
    category: "Self-Growth",
    price: 19,
    color: "#a36b43",
    image:
      "https://images.unsplash.com/photo-1638657527755-ca3e0d217260?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    title: "Little Women",
    author: "Louisa May Alcott",
    description: "Follow the four March sisters through family life, growing pains, and big dreams.",
    category: "Classics",
    price: 20,
    color: "#6B1E2E",
    image:
      "https://images.unsplash.com/photo-1721775999121-7be73ba0e29f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    title: "The Wildwood Tales",
    author: "M. L. Hawthorne",
    description: "A woodland adventure full of curious creatures, friendship, and gentle wonder.",
    category: "Kids",
    price: 14,
    color: "#647457",
    image:
      "https://images.unsplash.com/photo-1605787050388-845c63b60920?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    title: "Brass Reading Lamp",
    author: "The Bookish Collection",
    description: "A warm brass-toned lamp to bring a soft glow to your favorite reading corner.",
    category: "Accessories",
    price: 34,
    color: "#9d7441",
    image:
      "https://images.unsplash.com/photo-1698935004292-47fb4d7e0b73?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    title: "Midnight Reading Candle",
    author: "Cedar, fig & old paper",
    description: "A cozy blend of cedar and fig made for slow evenings and one more chapter.",
    category: "Accessories",
    price: 24,
    color: "#3b3032",
    image:
      "https://images.unsplash.com/photo-1711185900579-359240b69257?auto=format&fit=crop&w=700&q=85",
  },
];

export const categories = [
  ["Fiction", "Stories that stay with you", products[0].image],
  ["Non-Fiction", "Curiosity, beautifully bound", products[1].image],
  ["Fantasy", "Other worlds await", products[2].image],
  ["Self-Growth", "Pages for becoming", products[3].image],
  ["Kids", "Little readers, big dreams", products[5].image],
  ["Accessories", "For your reading ritual", products[6].image],
];
