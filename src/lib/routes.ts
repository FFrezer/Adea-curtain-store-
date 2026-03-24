export type ProductId = string;

export type ProductRoute = `/admin/products/${string}`;
export type ProductApiRoute = `/api/admin/product/${string}`;

export const getProductRoute = (id: ProductId): ProductRoute =>
  `/admin/products/${id}`;

export const getProductApiRoute = (id: ProductId): ProductApiRoute =>
  `/api/admin/product/${id}`;