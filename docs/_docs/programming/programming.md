---
title: Programming documentation
category: Programming category
order: 1
---
# Overview
# Backend
## Authorization
As mentioned in [Authorization](../../administration/authorization) section, ecoseller uses roles and permissions to restrict access to certain parts of the application. 

To have better control over permissions representation and their grouping, we created 2 new models: 
* `ManagerPermission` - for permission representation. It consists of:
  * `name` - name of permission with predefined format: *\<model_name\>*_*\<permission_type\>*_permission.
  * `model` - name of model to which this permission corresponds
  * `description` - text description of permission
  * `type` - type of permission. Enum of 4 possible values:
    * `view`
    * `add`
    * `change`
    * `delete`
* `ManagerGroup` - for group representation. It consists of:
  * `name` - name of group
  * `description` - text description of group
  * `permissions` - M2M field to permissions of which this group consists.

Each group/permission should be convertable to DRF group/permission.

### RolesManager
`RolesManager` is our internal python class for handling permissions and (almost) everything related to them. It consists purely of static methods, so we can call them anywhere across the code. 

Its main usage is:
* Loading initial predefined roles from config and creating `ManagerGroup` and `ManagerPermission` objects from it
* Conversion between `DRF Group` and `ManagerGroup`, and also between `DRF Permission` and `ManagerPermission`

### Initial roles definitions and their loading
As mentioned earlier, we have [`roles.json` config](../../administration/authorization) file which has initial roles definition and [`RolesManager`](#rolesmanager) class which is responsible for loading it. We achieved this behaviour by following adjustments:
1. We created `initial_data.py` file along with `populate_groups` method in it. In this method, we :
   1. load `roles.json` config with `RolesManager` class and create instances of `ManagerGroup` and `ManagerPermission`
   2. Create DRF Groups from loaded `ManagerGroup` objects
   3. Create general DRF permissions from `app_config`
   4. Convert all DRF permissions to `ManagerPermission` objects
   5. Assign `ManagerPermission` objects to corresponding `ManagerGroup` objects
2. We put `populate_groups` method in our `user` migration file `0002_auto_20230316_1534.py` to the `operations` part - this will ensure that when this migration runs, it will also trigger `populate_groups` method

### Protecting views with permissions
In order to apply our permission restrictions, we defined two custom decorators are defined: `@check_user_access_decorator` and `@check_user_is_staff_decorator` (their definition can be found in `backend/core/roles/decorator.py`).

### `@check_user_access_decorator`
The decorator is used mainly for `POST`, `PUT` and `DELETE` views.
It checks if the user has the permission to perform the action. If the user has the permission, the view is executed. Otherwise, the view returns `403` status code.
#### Parameters
- `permissions`: Set of permissions that the user needs to have to access view

#### Usage example
To check whether the user has `product_change_permission` permission for accessing `put` method, put decorator above the method:
```python
    @check_user_access_decorator({"product_change_permission"})
    def put(self, request, id):
        return super().put(request, id)
```

### `@check_user_is_staff_decorator`
The decorator is used mainly for `GET` views. It checks if the user is staff (`is_staff` field in `User` model). If the user is staff, the view is executed. Otherwise, the view returns `403` status code.

#### Parameters
- None: The decorator does not take any parameters

#### Usage example
To check whether the user is staff for accessing `get` method, put decorator above the method:
```python
    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)
```

# Frontend

## Context providers
To be able to access various data in different parts of the application, we use React Context. More information about React Context can be found on the following links:
* [Passing data deeply with context](https://react.dev/learn/passing-data-deeply-with-context)
* [useContext](https://react.dev/reference/react/useContext)

In further parts of this section, we assume that the reader is familiar with React Context and its usage from the links above.

In ecoseller, we use various context providers, and now we will describe them in more detail.

### UserProvider
`UserProvider` is a context provider that provides information about the currently logged in user to its children. It is used in both `Dashboard` and `Storefront` component, although they differ a bit in data they provide.

#### Parameters
- `children`: React component that is wrapped by the provider

#### Return value
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

#### Usage example
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


### PermissionProvider
As mentioned in [Authorization](../../administration/authorization) section, ecoseller uses roles and permissions to restrict access to certain parts of the application. `PermissionProvider` is a context provider that provides information about user's permissions to its children. It is used in `Dashboard` component.

To ensure proper usage, we defined `ContextPermissions` type with permissions that may be passed to the provider. The type is defined in `dashboard/utils/context/permission.tsx` file.

#### Parameters
- `allowedPermissions`: Array of `ContextPermissions` - permissions the user needs to have to gain access to the component
- `children`: React component that is wrapped by the provider

#### Return value
- `hasPermission`: boolean - true if the user has all permissions from `allowedPermissions` array, false otherwise

#### Usage example
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


### CartProvider
`CartProvider` is a context provider that provides information about the user's cart as well as some usefull functions to its children. It is used only in `Storefront` component.

#### Parameters
- `children`: React component that is wrapped by the provider

#### Return value
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

#### Functions provided by `CartProvider`
##### `addToCart`
Adds item to the cart. If the item is already in the cart, it updates its quantity.
Takes following parameters:
* `sku`: SKU of the product
* `qty`: quantity of the product
* `product`: product ID
* `pricelist`: pricelist ID
* `country`: country ID

##### `removeFromCart`
Deletes item from the cart. Takes following parameters:
* `sku`: SKU of the product

##### `updateQuantity`
Updates quantity of the item in the cart. Takes following parameters:
* `sku`: SKU of the product
* `quantity`: new quantity of the product

##### `clearCart`
Clears the cart. Takes no parameters.

##### `cartProductQuantity`
Returns quantity of the product in the cart. Takes following parameters:
* `sku`: SKU of the product

#### Usage example
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

### CookieProvider
`CookieProvider` is a context provider that provides information about the user's cookies as well as some usefull functions to its children. It is used only in `Storefront` component.

#### Parameters
- `children`: React component that is wrapped by the provider

#### Return value
- `cookieState` - set consisting of set of boolean flags:
  - `neccessaryCookies` - whether the user has accepted neccessary cookies
  - `preferenceCookies` - whether the user has accepted preference cookies
  - `statisticalCookies` - whether the user has accepted statistical cookies
  - `adsCookies` - whether the user has accepted ads cookies
  - `openDisclaimer` - whether to show cookie disclaimer
- `setCookieState` - function for setting cookie state
- `setCookieSettingToCookies` - function for setting cookie setting to cookies
- `toggleDisclaimer` - function for toggling cookie disclaimer

#### Functions provided by `CookieProvider`
##### `setCookieState`
Sets cookie state. Takes following parameters:
* `key`: type of cookie
* `value`: boolean value to set to the cookie

##### `setCookieSettingToCookies`
Sets cookie setting to cookies. Takes following parameters:
* `allTrue`: whether all cookies are accepted

##### `toggleDisclaimer`
Toggles cookie disclaimer. Takes following parameters:
* `value`: whether to show cookie disclaimer

#### Usage example
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


### CountryProvider
