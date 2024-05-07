import React, { FC } from "react";
import { productsState } from "state";
import { useRecoilValue } from "recoil";
import { Section } from "components/section";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";
import { DisplayPrice } from "components/display/price";
import { Link } from "react-router-dom";
export const SellingProducts: FC = () => {
  const products = useRecoilValue(productsState);
  const bestsellingProducts = products.filter((product) => product.bestseller);

  return (
    <Section title="Sản phẩm bán chạy">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{ delay: 3000 }}
      >
        {bestsellingProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <Box>
              <Link to={`/product/${product.id}`}>
                <img
                  className="w-full"
                  src={product.image}
                  alt={product.name}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <h3
                  className="absolute top-0 left-0 p-4 text-white bg-red-500"
                  style={{ zIndex: 10 }}
                >
                  {product.name} - <DisplayPrice>{product.price}</DisplayPrice>
                </h3>
              </Link>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export default SellingProducts;
