import { FinalPrice } from "components/display/final-price";
import React, { FC } from "react";
import { Product } from "types/product";
import { Box, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import { Link } from "react-router-dom";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  return (
    <div>
      <ProductPicker product={product}>
        {({ open }) => (
          <div className="space-y-2">
            <Link to={`/product/${product.id}`}>
              <Box className="w-full aspect-square relative">
                <img
                  loading="lazy"
                  src={product.image}
                  className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover object-center rounded-lg bg-skeleton"
                  alt={product.name}
                />
              </Box>
            </Link>
            <Text className="text-center">{product.name}</Text>
            <Text size="xxSmall" className="text-gray text-center pb-2">
              <FinalPrice>{product}</FinalPrice>
            </Text>

            <Text className="flex items-center justify-center">
              <button
                className="p-2 bg-black text-white text-center"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                <p className="font-bold text-sm">Thêm vào giỏ hàng</p>
              </button>
            </Text>
          </div>
        )}
      </ProductPicker>
    </div>
  );
};
