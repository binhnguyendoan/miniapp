import { FinalPrice } from "components/display/final-price";
import { DisplayPrice } from "components/display/price";
import { ProductPicker } from "components/product/picker";
import { Section } from "components/section";
import { ProductSlideSkeleton } from "components/skeletons";
import React, { Suspense } from "react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { recommendProductsState } from "state";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Text } from "zmp-ui";
import { Link } from "react-router-dom";
export const RecommendContent: FC = () => {
  const recommendProducts = useRecoilValue(recommendProductsState);

  return (
    <Section title="Gợi ý cho bạn" padding="title-only">
      <Swiper slidesPerView={1.25} spaceBetween={16} className="px-4">
        {recommendProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductPicker product={product}>
              {({ open }) => (
                <div className="space-y-3">
                  <Link to={`/product/${product.id}`}>
                    <Box
                      className="relative aspect-video rounded-lg bg-cover bg-center bg-skeleton"
                      style={{ backgroundImage: `url(${product.image})` }}
                    >
                      {product.sale && (
                        <Text
                          size="xxxxSmall"
                          className="absolute right-2 top-2 uppercase bg-green text-white h-4 px-[6px] rounded-full"
                        >
                          Giảm{" "}
                          {product.sale.type === "percent" ? (
                            `${product.sale.percent * 100}%`
                          ) : (
                            <DisplayPrice>{product.sale.amount}</DisplayPrice>
                          )}
                        </Text>
                      )}
                    </Box>

                    <Box className="space-y-1">
                      <Text size="small">{product.name}</Text>
                      <Text size="xxSmall" className="line-through text-gray">
                        <DisplayPrice>{product.price}</DisplayPrice>
                      </Text>
                      <Text size="large" className="font-medium text-primary">
                        <FinalPrice>{product}</FinalPrice>
                      </Text>
                    </Box>
                  </Link>
                  <Text className="">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export const RecommendFallback: FC = () => {
  const recommendProducts = [...new Array(3)];

  return (
    <Section title="Gợi ý cho bạn" padding="title-only">
      <Swiper slidesPerView={1.25} spaceBetween={16} className="px-4">
        {recommendProducts.map((_, i) => (
          <SwiperSlide key={i}>
            <ProductSlideSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export const Recommend: FC = () => {
  return (
    <Suspense fallback={<RecommendFallback />}>
      <RecommendContent />
    </Suspense>
  );
};
