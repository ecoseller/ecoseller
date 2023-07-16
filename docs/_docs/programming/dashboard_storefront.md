---
title: Dashboard and Storefront
category: Programming documentation
order: 3
---

Table of contents:
* TOC
{:toc}

# Dashboard

# Storefront

# Context providers
To be able to access various data in different parts of the application, we use React Context. More information about React Context can be found on the following links:
* [Passing data deeply with context](https://react.dev/learn/passing-data-deeply-with-context)
* [useContext](https://react.dev/reference/react/useContext)

In further parts of this section, we assume that the reader is familiar with React Context and its usage from the links above.

In ecoseller, we use various context providers, and now we will describe them in more detail.

## UserProvider
`UserProvider` is a context provider that provides information about the currently logged in user to its children. It is used in both `Dashboard` and `Storefront` component, although they differ a bit in data they provide.

### Parameters
- `children`: React component that is wrapped by the provider

### Return value
- `user`: fetched data from `/user/detail/` endpoint. Consists of:
    - `email` - email of the user
    - `first_name` - first name of the user
    - `last_name` - last name of the user
    - `birth_date` - birth date of the user
    - `is_active` - whether the user is active
    - `is_admin` - whether the user is admin
    - `is_staff` - whether the user is staff
- `roles`: fetched data from `/roles/user-groups/${email}`. Consists of:
    - `name` - name of the role
    - `description` - description of the role
    - `permissions` - list of permissions of the role. Each permission consists of:
        - `name` - name of the permission
        - `description` - description of the permission
        - `type` - type of the permission
        - `model` - model to which the permission corresponds

`UserProvider` in `Storefront` only provides `user` data, while `Dashboard` provides both `user` and `roles` data.

### Usage example
`UserProvider` already wraps whole application in both `Dashboard` and `Storefront` components, so we can access user data in any child component. To access user data, we use `useUser` hook:

- In dashboard:
```typescript
const ChildComponent = () => {
    ...
    const { user, roles } = useUser();
    ...
    return (
        ...
    );
};
```
- In storefront:
```typescript
const ChildComponent = () => {
    ...
    const { user } = useUser();
    ...
    return (
        ...
    );
};
```


## PermissionProvider
As mentioned in [Authorization](../../administration/authorization) section, ecoseller uses roles and permissions to restrict access to certain parts of the application. `PermissionProvider` is a context provider that provides information about user's permissions to its children. It is used in `Dashboard` component.

To ensure proper usage, we defined `ContextPermissions` type with permissions that may be passed to the provider. The type is defined in `dashboard/utils/context/permission.tsx` file.

### Parameters
- `allowedPermissions`: Array of `ContextPermissions` - permissions the user needs to have to gain access to the component
- `children`: React component that is wrapped by the provider

### Return value
- `hasPermission`: boolean - true if the user has all permissions from `allowedPermissions` array, false otherwise

### Usage example
To check whether the user has `user_add_permission` permission for adding new user, wrap the component with `PermissionProvider`:
```typescript
    <PermissionProvider allowedPermissions={["user_add_permission"]}>
        <EditableContentWrapper>
            <CreateUser />
        </EditableContentWrapper>
    </PermissionProvider>
```
Now, we can check in respective component whether the user has the permission:
```typescript
    const CreateUser () => {
        ...
        const { hasPermission } = usePermission();
        ...
        return (
            ...
            <TextField
                disabled={!hasPermission}
            >
            Email
            </TextField>
            ...
        );
    };
```
```typescript
const EditableContentWrapper = () => {
    ...
    const { hasPermission } = usePermission();
    ...
    return (
        ...
        <Button
            disabled={!hasPermission}
        >
        Save
        </Button>
        ...
    );
};
```
This will disable the `TextField` and `Button` components if the user does not have `user_add_permission` permission.


## CartProvider
`CartProvider` is a context provider that provides information about the user's cart as well as some usefull functions to its children. It is used only in `Storefront` component.

### Parameters
- `children`: React component that is wrapped by the provider

### Return value
- `cart`: fetched data from `/cart/storefront/<str:token>` endpoint. Consists of:
    - `token` - token of the cart
    - `cart_items` - items of the cart
    - `update_at` - date of the last update of the cart
    - `total_items_price_incl_vat_formatted` - total price of the cart including VAT
    - `total_items_price_without_vat_formatted` - total price of the cart without VAT
    - `total_price_incl_vat_formatted` - total price of the cart including VAT and shipping
    - `total_price_without_vat_formatted` - total price of the cart without VAT and shipping
    - `shipping_method_country` - id to `ShippingMethodCountry` object
    - `payment_method_country` - id to `PaymentMethodCountry` object
- `cartSize`: number of items in the cart
- `addToCart` - function for adding item to the cart
- `removeFromCart` - function for removing item from the cart
- `updateQueantity` - function for updating quantity of the item in the cart
- `clearCart` - function for clearing the cart
- `cartProductQuantity` - function for getting quantity of the product in the cart

### Functions provided by `CartProvider`
#### `addToCart`
Adds item to the cart. If the item is already in the cart, it updates its quantity.
Takes following parameters:
* `sku`: SKU of the product
* `qty`: quantity of the product
* `product`: product ID
* `pricelist`: pricelist ID
* `country`: country ID

#### `removeFromCart`
Deletes item from the cart. Takes following parameters:
* `sku`: SKU of the product

#### `updateQuantity`
Updates quantity of the item in the cart. Takes following parameters:
* `sku`: SKU of the product
* `quantity`: new quantity of the product

#### `clearCart`
Clears the cart. Takes no parameters.

#### `cartProductQuantity`
Returns quantity of the product in the cart. Takes following parameters:
* `sku`: SKU of the product

### Usage example
`CartProvider` already wraps whole application, so we can access data or functions in any child component. To do so, we use `useCart` hook:
```typescript
const ChildComponent = () => {
    ...
    const { cart, cartSize, addToCart, removeFromCart, updateQuantity, clearCart, cartProductQuantity } = useCart();
    ...
    return (
        ...
    );
};
```

## CookieProvider
`CookieProvider` is a context provider that provides information about the user's cookies as well as some usefull functions to its children. It is used only in `Storefront` component.

### Parameters
- `children`: React component that is wrapped by the provider

### Return value
- `cookieState` - set consisting of set of boolean flags:
  - `neccessaryCookies` - whether the user has accepted neccessary cookies
  - `preferenceCookies` - whether the user has accepted preference cookies
  - `statisticalCookies` - whether the user has accepted statistical cookies
  - `adsCookies` - whether the user has accepted ads cookies
  - `openDisclaimer` - whether to show cookie disclaimer
- `setCookieState` - function for setting cookie state
- `setCookieSettingToCookies` - function for setting cookie setting to cookies
- `toggleDisclaimer` - function for toggling cookie disclaimer

### Functions provided by `CookieProvider`
#### `setCookieState`
Sets cookie state. Takes following parameters:
* `key`: type of cookie
* `value`: boolean value to set to the cookie

#### `setCookieSettingToCookies`
Sets cookie setting to cookies. Takes following parameters:
* `allTrue`: whether all cookies are accepted

#### `toggleDisclaimer`
Toggles cookie disclaimer. Takes following parameters:
* `value`: whether to show cookie disclaimer

### Usage example
`CookieProvider` already wraps whole application, so we can access data or functions in any child component. To do so, we use `useCookie` hook:
```typescript
const ChildComponent = () => {
    ...
    const { cookieState, setCookieState, setCookieSettingToCookies, toggleDisclaimer } = useCookie();
    ...
    return (
        ...
    );
};
```

## CountryProvider
`CountryProvider` is a context provider that provides information about the country that is currently set by the user, as well as some usefull functions to its children. It is used only in `Storefront` component.

### Parameters
- `children`: React component that is wrapped by the provider

### Return value
- `country`: object representing country. Consists of:
  - `code` - id of the country
  - `name` - name of the country
  - `locale` - locale of the country
  - `default_price_list` - id of the default price list of the country
- `countryList`: list of `country` objects - all available countries
- `setCountryCookieAndLocale` - function for setting country cookie and locale

### Functions provided by `CountryProvider`
#### `setCountryCookieAndLocale`
Sets country cookie and locale. Takes following parameters:
* `countryCode`: code of the country

### Usage example
`CountryProvider` already wraps whole application, so we can access data or functions in any child component. To do so, we use `useCountry` hook:
```typescript
const ChildComponent = () => {
    ...
    const { country, countryList, setCountryCookieAndLocale } = useCountry();
    ...
    return (
        ...
    );
};
```

## RecommenderProvider
`RecommenderProvider` is a context provider that provides information about the user's recommender session as well as some usefull functions to send either recommender event or retrive recommendations. It is used only in `Storefront` component.

# Interceptors
Interceptors are used to intercept requests and responses before they are handled by the application. In ecoseller, we use them to add authorization token and other data to requests and to handle errors. We use `axios` library for handling requests and responses. More information about interceptors can be found on the following links:
* [Axios - Getting started](https://axios-http.com/docs/intro)
* [Axios interceptors](https://axios-http.com/docs/interceptors)

In further parts of this section, we assume that the reader is familiar with `axios` library and its usage from the links above.
Interceptors in the `Dashboard` and `Storefront` differ a bit, so we will describe them separately.
## Request interceptor - Dashboard
In the `Dashboard`, we use request interceptor to add authorization token to requests. The interceptor is defined in `dashboard/utils/interceptors/api.ts` file.
Fisrtly, we define `api` axios instance with base url and headers:
```typescript
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
```
Then, we add request interceptor to the `api` instance:
* for the request
```typescript
api.interceptors.request.use((config) => {
  let access = "";
  let refresh = "";
  if (isServer()) {
    access = getCookie("accessToken", { req, res }) as string;
    refresh = getCookie("refreshToken", { req, res }) as string;
  } else {
    access = Cookies.get("accessToken") || "";
    refresh = Cookies.get("refreshToken") || "";
  }

  if (access) {
    config.headers.Authorization = `JWT ${access}`;
  }
  return config;
});
```
* for the response
```typescript
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // check conditions to refresh token
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !error.response?.config?.url?.includes("user/refresh-token") &&
      !error.response?.config?.url?.includes("user/login")
    ) {
      return refreshToken(error);
    }
    return Promise.reject(error);
  }
);
```
Where the `refreshToken` is a function responsible for fetchiing a new access token and retrying the request. It is defined in `dashboard/utils/interceptors/api.ts` file.

## Request interceptor - Storefront
In the `Storefront`, we use request interceptor to add authorization token and country locale to requests. The interceptor is defined in `storefront/utils/interceptors/api.ts` file.
Axios instance in the `Storefront` is defined similarly as in the `Dashboard` ([see above](#request-interceptor---dashboard)).
The difference is in the request interceptor, where we also add a country locale to the `Accept-Language` header:
```typescript
api.interceptors.request.use((config) => {

  ... // similar to the Dashboard

  // set locale (if present)
  const locale = getLocale();
  if (locale) {
    config.headers["Accept-Language"] = locale;
  }

  return config;
});
```