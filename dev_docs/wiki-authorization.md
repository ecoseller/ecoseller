# Core part

We use token-based authentication, concretely JSON Web Token authentication plugin - [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/). 

**To incorporate this plugin, we had to make following adjustements:**
1. settings.py - JWT configuration, REST configuration, defining auth backends ([section link](#configuration))
2. urls.py - new urls for authentication ([section link](#authorization-urls))
3. views.py - new views for authentication ([section link](#authorization-views))
4. serializers.py - new serializers for authentication ([section link](#authentication-serializers))
5. authentication.py - new authentication backend ([section link](#custom-authentication-backend))

## Configuration
For general authorization configuration, `settings.py`  was modified. 

We defined `SIMPLE_JWT` dictionary which configures our web tokens. Definition for all fields can be found [here](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html), but there are few which we had to change a bit and deserve to be highlighted:
* ACCESS_TOKEN_LIFETIME
* REFRESH_TOKEN_LIFETIME
* AUTH_HEADER_TYPES
* AUTH_HEADER_NAME
* USER_ID_FIELD
* USER_ID_CLAIM

Next, we modified REST_FRAMEWORK configuration, setting `DEFAULT_PERMISSION_CLASSES` to consist only of `rest_framework.permissions.IsAuthenticated` - this will ensure that only authenticated user will be able to access our views. Of course we need also views for unauthorized users (to allow them authenticate themselves in the first place), which we achieved by decorators to given views (for more info see [views section](#authorization-views)). Additionally, we modified `DEFAULT_` to consist only of `rest_framework_simplejwt.authentication.JWTAuthentication` - this determines the default set of authenticators used when accessing the `request.user` or `request.auth` properties (which is handled by JWT authentication in our case).

Another modification was done in `AUTHENTICATION_BACKENDS` list, where we added our custom authorization backend - `user.authentication.UserAuthBackend` (for more info see [authentication backend section](#custom-authentication-backend))

## Authorization urls
To be able to use authentication, we now have following urls with given meaning:
1. **register** - defined by our custom `RegistrationView` to allow user register new account (for more info see [views section](#authorization-views))
2. **login** - defined by built-in JWT view for obtaining token - `TokenObtainPairView`
3. **refresh-token** - defined by built-in JWT view for refreshing token - `TokenRefreshView`
4. **logout** - defined by our custom `BlacklistTokenView` to logout user and blacklist his/her refresh token (for more info see [views section](#authorization-views))
5. **detail** - defined by our custom `UserView` to acquire info about user from authentication token (for more info see [views section](#authorization-views))

## Authorization views
We have following views connected with our authorization system:
1. **RegistrationView**
   * **POST** - has `permission_classes` decorator set to `AllowAny` to allow unauthorized users access this view. Expects data in format that fits `RegistrationSerializer` (for more info see [serializers section](#authentication-serializers)) which then creates new user and saves his/hers credentails.
2. **BlacklistTokenView** 
   * **POST** - has `permission_classes` decorator set to `AllowAny` to allow unauthorized users access this view. Used to logout users. Expects refresh token in requests data. This token is then blacklisted and prevents anybody else to use it for acquiring new access token.
3. **UserView**
   * **GET** - currently for testing purposes. Testing authentication classes via acquiring `user` and `auth` info from request and printing them.

## Authentication serializers
To be able to proccess authetication request data, following serializers are defined:
1. **RegistrationSerializer** - requires `email` and `password` fields. Defines `create` method for creating a new user and saving his/hers credentails.
2. **UserSerializer** - Used for serialization of user. Consists of following fields:
   1. email
   2. first_name
   3. last_name
   4. birth_date
   5. is_active
   6. is_admin
   7. is_staff

## Custom authentication backend
For defining custom `authenticate` function we have `UserAuthBackend` defined. It expects `HTTP_AUTHORIZATION` in request header and from that extracts username (email). From this it finds and returns corresponding user, or throws exception if something goes wrong (e.g. user does not exist, authorization token is incorrect).

# Dashboard part
 JWT tokens are stored in cookies on client side. For automized token usage in each request, we use [Axios interceptors](https://axios-http.com/docs/interceptors).

## Axios
We have defined 2 axios instances:
* **Public** - used for requests that do not require JWT tokens in their header.
* **Private** -  implements interceptors for both request and response to incorporate token workflow.

### Request interceptor
Takes access token from cookies and appends it to request header in following format: `authorization: JWT ${accessToken}`

### Response interceptor
If there is no error in response, it is send further without modification. If there is error, we check whether it is due to wrong authorization. If so, we try to obtain new access token via refresh token and pass it in config further.

## Login page
Login page is using private axios instance to post request with user credentials. If authorization on backend was successful, it then saves access and refresh tokens to clients cookies.

## Logout page
Logout page is using private axios instance to post request on `user/logout` endpoint with refresh token (to get it blacklisted) and then removes refresh and access tokens from clients cookies.

# Permissions
Another important part of our authorization system are permissions. To explain this concept fully, we will go through following sections:
1. DRF Permissions vs our permissions
2. Roles config
3. RolesManager
4. Initial roles definitions and their loading
5. Protecting views with permissions

## DRF Permissions vs our permissions
To have better control over permissions representation and their grouping, we created 2 new models: 
* `ManagerPermission` - for permission representation. It consists of
  * name - name of permission with predefined format: *<model_name>*_*<permission_type>*_permission.
  * model - name of model to which this permission corresponds
  * description - text description of permission
  * type - type of permission. Enum of 4 possible values:
    * view
    * add
    * change
    * delete
* `ManagerGroup` - for group representation. It consists of
  * name - name of group
  * description - text description of group
  * permissions - M2M field to permissions of which this group consists.

Each group/permission should be convertable to DRF group/permission.

## Roles config
We allow user to define some initial roles which will be created on the start of the application. These roles are defined via config (`roles.json`) in following json format:
```
[
    {
        "Role1" : {
            "permissions" : [
                {
                    "name" : "Permission1",
                    "description" : "Permission1 description"
                    "type" : "ADD",
                    "model" : "Model1"
                },
                {
                    "name" : "Permission2",
                    "description" : "Permission2 description",
                    "type" : "CHANGE",
                    "model" : "Model1"
                },
                {
                    "name" : "Permission3",
                    "description" : "Permission3 description",
                    "type" : "DELETE",
                    "model" : "Model2"
                }
            ],
            "decription" : "Description of Role1",
            "name" : "Role1Name"
        }
    },
    {
        "Role2" :{
                "permissions" : [
                    {               
                        "name" : "Permission4",
                        "description" : "Permission4 description",
                        "type" : "VIEW",
                        "model" : "Model1"
                    },
                    {
                        "name" : "Permission5",
                        "description" : "Permission5 description"
                        "type" : "DELETE",
                        "model" : "Model3"
                    },
                    {
                        "name" : "Permission6",
                        "description" : "Permission6 description",
                        "type" : "CHANGE",
                        "model" : "Model3"
                    },
                    {
                        "name" : "Permission1",
                        "description" : "Permission1 description"
                        "type" : "ADD",
                        "model" : "Model1"
                    }
                ]
                "description" : "Description of Role2",
                "name" : "Role2Name"
            }
    }
]
```

## RolesManager
`RolesManager` is our internal python class for handling permissions and (almost) everything related to them. It consists purely of static methods, so we can call them anywhere across the code. 

Its main usage is:
* Loading initial predefined roles from config and creating `ManagerGroup` and `ManagerPermission` objects from it
* Conversion between `DRF Group` and `ManagerGroup`, and also between `DRF Permission` and `ManagerPermission`

## Initial roles definitions and their loading
As mentioned earlier, we have `roles.json` config file which has initial roles definition and `RolesManager` class which is responsible for loading it. We achieved this behaviour by following adjustments:
1. We created `initial_data.py` file along with `populate_groups` method in it. In this method, we :
   1. load `roles.json` config with `RolesManager` class and create instances of `ManagerGroup` and `ManagerPermission`
   2. Create DRF Groups from loaded `ManagerGroup` objects
   3. Create general DRF permissions from `app_config`
   4. Convert all DRF permissions to `ManagerPermission` objects
   5. Assign `ManagerPermission` objects to corresponding `ManagerGroup` objects
2. We put `populate_groups` method in our `user` migration file `0002_auto_20230316_1534.py` in `operations` part - this will ensure that when this migration runs, it will also trigger `populate_groups` method

## Protecting views with permissions
In order to apply our permission restrictions, we defined `check_user_access_decorator`. It takes 1 parameter - set of permissions that user needs to have to access view. To use this decorator, all we need to do is put it on top of view function definition alogn with its parameter. Example usage may look like this:

```
@check_user_access_decorator(
    {"Product_view_permission", "Product_change_permission"}
)
```
This will ensure that user will have permission to view and change product. If so, normal view function will be called, otherwise `Response(status=403)` will be returned.