// src/types/product.ts

import type { Product, ProductImage, Variant } from '@prisma/client';

export type { Product, ProductImage };
export type TransformedProduct = {
  id: string;
  name: string;
  price: number | null;
  category: string;
  room?: string;
  featured?: boolean;
  image?: string;
  createdAt: Date;
  published: boolean;
  description: string | null;
    images?: ProductImage[];
  


};

export type ProductWithExtras = Product & {
  images: ProductImage[];
  variants: (Variant & { name: string })[];
   
};
