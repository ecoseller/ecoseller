import ProductHighlight from "@/components/product/ProductHighlight";
import { contentGetter } from "../Output";

const ProductRenderer = ({data}) => {

	let content = contentGetter(data);

	return content !== null ?
		<ProductHighlight />
	: <></>;
}

export default ProductRenderer;