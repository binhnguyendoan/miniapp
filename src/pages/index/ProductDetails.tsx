import React, { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "types/product";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { productsState, cartState } from "state";
import { Icon } from "zmp-ui";
import { Link } from "react-router-dom";
import { QuantityPicker } from "../../components/product/quantity-picker";
import { SingleOptionPicker } from "../../components/product/single-option-picker";
import { MultipleOptionPicker } from "../../components/product/multiple-option-picker";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

interface SelectedOptions {
  [key: string]: string | string[];
}

const ProductDetails: FC = () => {
  const location = useLocation();
  const products = useRecoilValue(productsState);
  const setCart = useSetRecoilState(cartState);
  const [productId, setProductId] = useState<string>("");
  const [options, setOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const pathname = location.pathname;
    const id = pathname.substring(pathname.lastIndexOf("/") + 1);
    setProductId(id);
  }, [location.pathname]);

  const productitem: Product | undefined = products.find(
    (item) => item.id === parseInt(productId)
  );
  useEffect(() => {
    if (productId && products.length > 0) {
      const productitem: Product | undefined = products.find(
        (item) => item.id === parseInt(productId)
      );
      if (productitem) {
        const related: Product[] = products.filter(
          (item) =>
            item.categoryId.some((id) => productitem.categoryId.includes(id)) &&
            item.id !== productitem.id
        );
        setRelatedProducts(related);
      }
    }
  }, [productId, products]);

  const addToCart = () => {
    if (productitem) {
      setCart((cart) => {
        let res = [...cart];
        const existed = cart.find(
          (item) =>
            item.product.id === productitem.id &&
            isIdentical(item.options, options)
        );
        if (existed) {
          res.splice(cart.indexOf(existed), 1, {
            ...existed,
            quantity: existed.quantity + quantity,
          });
        } else {
          res = res.concat({
            product: productitem,
            options: options,
            quantity: quantity,
          });
        }
        return res;
      });
    }
  };
  useEffect(() => {}, [options, quantity]);
  const handleOptionChange = (
    variantId: string,
    selectedOption: string | string[]
  ) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [variantId]: selectedOption,
    }));
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div
      className="p-[15px] overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 60px)" }}
    >
      <h1 className="flex">
        <Link to="/" className="text-big uppercase font-bold">
          Trang chủ
        </Link>{" "}
        <Icon className="font-bold" icon="zi-chevron-right" />{" "}
        <p className="font-bold">{productitem?.name}</p>
      </h1>

      <img
        className="w-full pt-[10px] h-[450px] object-cover "
        src={selectedImage || productitem?.image}
        alt={productitem?.name}
      />
      <Swiper spaceBetween={10} slidesPerView={3} navigation loop>
        {productitem?.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              className="w-full pt-[10px] h-[200px] object-cover"
              src={image}
              alt={`Image ${index}`}
              onClick={() => handleImageClick(image)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <h3 className="pt-[10px] text-[30px]">{productitem?.name}</h3>
      <p>
        {productitem?.price?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </p>
      <p>{productitem?.description}</p>

      {productitem?.variants &&
        productitem.variants.map((variant) =>
          variant.type === "single" ? (
            <SingleOptionPicker
              key={variant.id}
              variant={variant}
              value={options[variant.id] as string}
              onChange={(selectedOption) =>
                handleOptionChange(variant.id, selectedOption)
              }
            />
          ) : (
            <MultipleOptionPicker
              key={variant.id}
              product={productitem}
              variant={variant}
              value={options[variant.id] as string[]}
              onChange={(selectedOption) =>
                handleOptionChange(variant.id, selectedOption)
              }
            />
          )
        )}
      <QuantityPicker value={quantity} onChange={setQuantity} />
      <div className="flex align-center justify-center">
        <button
          className="w-full bg-black text-white p-[10px] "
          onClick={addToCart}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
      <div>
        <h2 className="text-[30px] text-center mt-[30px] mb-[30px]">
          Các sản phẩm liên quan
        </h2>
        <Swiper spaceBetween={10} slidesPerView={2} navigation loop>
          {relatedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div>
                <Link to={`/product/${product.id}`}>
                  <img
                    className="w-full h-[300px] object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                  <p className="text-center font-bold">{product.name}</p>
                  <p className="text-center">
                    {product.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductDetails;
