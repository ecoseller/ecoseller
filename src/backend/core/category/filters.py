from product.models import BaseAttribute


# class NumericFilter:
#     """
#     Class representing product filter with numeric values
#
#     id - id of the selected AttributeType
#     min_value_id - id of the BaseAttribute with selected minimal value
#     max_value_id - id of the BaseAttribute with selected maximal value
#     """
#
#     def __init__(self, id, min_value_id, max_value_id):
#         self.id, self.min_value_id, self.max_value_id = id, min_value_id, max_value_id
#
#     def matches(self, product_variant):
#         """
#         Check if the given product variant matches this filter
#         """
#         if (
#             self.min_value_id is None and self.max_value_id is None
#         ):  # If no limits are set, the filter matches
#             return True
#
#         try:
#             base_attribute_value = float(
#                 product_variant.attributes.get(type__pk=self.id).value
#             )
#             min_selected_value = (
#                 float(BaseAttribute.objects.get(id=self.min_value_id).value)
#                 if self.min_value_id is not None
#                 else -math.inf
#             )
#             max_selected_value = (
#                 float(BaseAttribute.objects.get(id=self.max_value_id).value)
#                 if self.max_value_id is not None
#                 else math.inf
#             )
#
#             return (
#                 min_selected_value <= base_attribute_value <= max_selected_value
#             )  # Check whether the attribute value is between selected `min` and `max`
#         except (BaseAttribute.DoesNotExist, ValueError):
#             return False


class Filter:
    """
    Class representing product filter with textual choice values

    id - id of the selected AttributeType
    selected_values_ids - ids of the selected BaseAttributes
    """

    def __init__(self, id, selected_values_ids):
        self.id, self.selected_values_ids = id, selected_values_ids

    def matches(self, product_variant):
        """
        Check if the given product variant matches this filter
        """
        if (
                not self.selected_values_ids
        ):  # If there are no selected values, always match
            return True

        try:
            base_attribute = product_variant.attributes.get(type__pk=self.id)
            return (
                    base_attribute.id in self.selected_values_ids
            )  # Check if `id` is contained in `selected_values_ids`
        except BaseAttribute.DoesNotExist:
            return False


class SelectedFilters:
    """
    Class representing set of filters used for filtering products

    Filters are divided into 2 categories: `numeric` and `textual`
    """

    def __init__(self, textual, numeric):
        self.textual, self.numeric = textual, numeric


class SelectedFiltersWithOrdering:
    """
    Class representing set of filters used for filtering products, together with product ordering

    Filters are divided into 2 categories: `numeric` and `textual`
    """

    def __init__(self, filters, sort_by, order):
        self.filters, self.sort_by, self.order = filters, sort_by, order

    def matches_variant(self, product_variant):
        """
        Check whether the given product variant matches all the selected filters
        """
        all_filters = self.filters.textual + self.filters.numeric
        return all([f.matches(product_variant) for f in all_filters])

    def matches_any_variant(self, product):
        """
        Check whether any of the product variant matches all the selected filters
        """
        return any([self.matches_variant(v) for v in product.product_variants.all()])
