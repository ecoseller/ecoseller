def format_price(price, pricelist):
    """
    Format the given price and return it as a string (which is intended to be shown to user)
    """
    if (
        price % 1 == 0
    ):  # If it's a whole number, convert it to int, to make sure there aren't any decimal places
        price = int(price)

    symbol = pricelist.currency.symbol
    symbol_position = pricelist.currency.symbol_position

    return f"{price} {symbol}" if symbol_position == "AFTER" else f"{symbol} {price}"
