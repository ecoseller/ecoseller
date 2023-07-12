# Authorization
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