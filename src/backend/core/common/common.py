def get_url_param_if_valid(
        request, param_name, allowed_values, default_param_value=None
):
    """
    Get url parameter if it exists and its value is valid (contained in `allowed_values`).

    Otherwise, return `None`
    """
    param = request.query_params.get(param_name, default_param_value)
    return param if param in allowed_values else None
