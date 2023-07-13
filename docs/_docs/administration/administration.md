---
title: Administration
category: Administration documentation
order: 2
---

# Working with **ecoseller** REST API
The ecoseller platform provides a comprehensive and powerful REST API that allows developers to interact with and extend the functionality of the e-commerce platform. This section of the documentation focuses on working with the ecoseller REST API and provides detailed guidance on utilizing its endpoints and authentication mechanisms. Please note that the ecoseller REST API was designed to be used primarily for dashboard purposes and is not intended to be used as a public API for the ecoseller platform. However, feel free to use it as you see fit.
On the other hand, please consider using `NotificationAPI` for public API purposes and calling external services directly from ecoseller backend.
## Authentication
Ecoseller's REST API authentication relies on JSON Web Tokens (JWT) to secure and authorize API requests. JWT is a compact and self-contained token format that securely transmits information between parties using digitally signed tokens. In the context of ecoseller, JWTs are utilized to authenticate and authorize API access intended for dashboard.
### Obtaining a JWT
To obtain a JWT, you need to send a POST request to the `/user/login/` endpoint with the following payload:
```json
{
    "email": "your_email",
    "password": "your_password",
    "dashboard_login": true
}
```

If the provided credentials are valid, the API will return a response containing the JWT token:
```json
{
    "access": "your_access_token",
    "refresh": "your_refresh_token"
}
```

The `access` token is used to authenticate API requests, while the `refresh` token is used to obtain a new access token once the current one expires. The access token is valid for 5 minutes, while the refresh token is valid for 24 hours. To obtain a new access token, you need to send a POST request to the `/user/refresh-token/` endpoint with the following payload:
```json
{
    "refresh": "your_refresh_token"
}
```

If the provided refresh token is valid, the API will return a response containing the new access token:
```json
{
    "access": "your_new_access_token"
}
```

### Using a JWT

Once you obtain a JWT, you need to include it in the `Authorization` header of your API requests. The header should have the following format:
```
Authorization: Bearer your_access_token
```

## API documentation
The ecoseller backend provides a comprehensive API documentation that can be accessed by navigating to the `/api/docs/` endpoint. This documentation is generated automatically using the [drf-yasg](https://drf-yasg.readthedocs.io/en/stable/) package and provides detailed information about the available endpoints, their parameters, and the expected responses. 
Please make sure to use primairly `/dashboard` endpoints since they're designed to to modify data and require authentication. Storefront endpoints don't.

# User management

## Creating a superuser


## Roles and permissions

# Managing database

## Binding database to a local folder

## Running migrations

## Backing up database

## Restoring database


# Static files and media

# Implementing payment methods (`PaymentAPI`)
This guide will walk you through the process of extending the Core application with new payment methods without encountering conflicts with the existing codebase. By following the provided guidelines and leveraging the system's flexible architecture, you'll be able to seamlessly integrate various online payment gateways into your ecoseller ecommerce platform.

Integrating online payment gateways into your ecommerce system offers numerous advantages. It allows your customers to securely make payments using their preferred payment methods, which can boost conversion rates and provide a seamless checkout experience. The ecoseller system's architecture has been designed to make the implementation of new payment methods straightforward, enabling you to expand your payment gateway options as your business grows.

## Payment Gateway Integration Process

To implement a new payment method within the ecoseller ecommerce system, you will need to follow these steps:

1. Choose the appropriate base class:
Your new payment method should inherit from either the `PayBySquareMethod` class or the `OnlinePaymentMethod` class. Both of these classes are derived from the `BasePaymentMethod` class and can be imported from `core.api.payments.modules.BasePaymentMethod`. Select the base class that aligns with the requirements of the payment gateway you are integrating. `PayBySquareMethod` is used in situations where it's neccessary to provide user payment QR code. On the other hand `OnlinePaymentMethod` is used for generating link for third party payment gateway where is user usually redirected.
**Note that classes inherited from `BasePaymentMethod` obtain instance of `Order` model (see `core.order.models`) on initialization. So you can freely access data of `Order` and `Cart`.**

2. Create a new payment method class:
In your codebase, create a new class that extends the chosen base class. Ideally put your code into separate file stored in `core/api/payments/modules`. Provide a meaningful name for the class that reflects the payment gateway you are integrating. For example, if integrating the "XYZ Gateway," you could name your class XYZGatewayMethod.
Implement the necessary methods:


### `PayBySquareMethod`
`PayBySquareMethod` is used to return Base64 encoded image and provide payment data such as IBAN, BIC, etc. In order to implement a payment method inherited from `PayBySquareMethod` you need to define two methods:

* `pay` - it's expected that this method return a dictonary containing two required keys.
* * `qr_code` - Base64 encoded image of the payment QR
* * `payment_data` - dictionary containing payment information stored in text with keys such as `amount`, `IBAN`, `payment_identification`, etc.
* `status` - method returning `PaymentStatus` (`core.api.payments.conf.PaymentStatus`). So for example - calling API of your bank and checking icomming payments.


### `OnlinePaymentMethod`
`OnlinePaymentMethod` is used to return payment link so that user can be redirected. In order to implement a payment method inherited from `OnlinePaymentMethod ` you need to define two methods:
* `pay` - it's expected that this method return a dictonary containing two required keys.
* * `payment_url` - link to the payment gateway (usually provided by the payment gateway API with `payment_id` in it).
* * `payment_id` - ID of the payment in the payment gateway
* `status` - method returning `PaymentStatus` (`core.api.payments.conf.PaymentStatus`). Usually implemented as a wrapper around payment gateway's status getter.


Examples:

```python
from .BasePaymentMethod import OnlinePaymentMethod, PayBySquareMethod
from ..conf import PaymentStatus


class TestGateway(OnlinePaymentMethod):
    def pay(self):
        return {"payment_url": "https://payment.url", "payment_id": "1234567890"}

    def status(self) -> PaymentStatus:
        """
        Moc status and return paid with some probability
        """
        import random

        if random.random() < 0.5:
            return PaymentStatus.PAID
        return PaymentStatus.PENDING

class BankTransfer(PayBySquareMethod):
    def pay(self):
        self.bic = self.kwargs.get("bic")
        self.iban = self.kwargs.get("iban")
        self.currency = self.kwargs.get("currency")
        self.variable_symbol = 123456789
        self.amount = 100

        return {
            "qr_code": "base64 encoded image",
            "payment_data": {
                "amount": self.amount,
                "currency": self.currency,
                "variable_symbol": self.variable_symbol,
                "iban": self.iban,
                "bic": self.bic,
            },
        }

    def status(self) -> PaymentStatus:
        """
        Mock status and return paid with some probability
        """
        import random

        if random.random() < 0.5:
            return PaymentStatus.PAID
        return PaymentStatus.PENDING

```

3. Registering payment method in the `Core`
In order to let the `Core` know about your payment methods, you need to define JSON configuration file. This file can be stored anywhere within accessible space for the `core`. However, to keep ecoseller practices, we recommend to store this file in `core/config/payments.json` (default path). Your custom path must be stored in the `PAYMENT_CONFIG_PATH` environment variable.

It's a dictionary containing unique identifiers of payment methods. Those identifiers are up to you, the only requirement is that you keep the unique constraint and that the name makes somehow sense. You will use this name also in the `dashboard` to link the payment method with your backend implementation.

Every payment method is required to have `implementation` key which is in the format `{module}.{class}`, so for example `api.payments.modules.BankTransfer.BankTransfer` or `api.payments.modules.TestGateway.TestGateway`. You can use optional key `kwargs` (keyword arguments) into which you can store everything constant that you want to access in the `BasePaymentMethod` implementation (it's stored into `self.kwargs` variable 😉). Usually this is used to pass your IBAN, ... into `PayBySquareMethod` or public key or path to public certificate into `OnlinePaymentMethod `.

Example:

```JSON
{
    "BANKTRANSFER_EUR": {
        "implementation": "api.payments.modules.BankTransfer.BankTransfer",
        "kwargs": {
            "currency": "EUR",
            "bankName": "Deutsche Bank",
            "accountNumber": "DE12500105170648489890",
            "swiftCode": "DEUTDEDBBER"
        }
    },
    "BANKTRANSFER_CZK": {
        "implementation": "api.payments.modules.BankTransfer.BankTransfer",
        "kwargs": {
            "currency": "CZK",
            "bankName": "CŠOB",
            "accountNumber": "CZ5855000000001265098001",
            "swiftCode": "CEKOCZPP"
        }
    },
    "TEST_API": {
        "implementation": "api.payments.modules.TestGateway.TestGateway",
        "kwargs": {
            "merchant": "123456",
            "secret": "1234567890abcdef1234567890abcdef",
            "url": "https://payments.comgate.cz/v1.0/"
        }
    }
}
```

4. Binding payment method to the implementation
So you have your payment method implementation ready and want to bind to your payment method object. On the `PaymentMethodCountry` model is a field ready for this situation. There're two ways to do it:

* **Using dashboard:** Navigate to the detail of payment method (Cart/Payment Methods) in the dashboard, scroll to _Country variants_ and set `API Request` for required country variant.

* **Using direct database access:** Find `cart_paymentmethodcountry` table in your database and set `api_request` field for the specific row the the value which you used as unique identifier of your payment method in the `JSON` config. So for example `BANKTRANSFER_CZK`. However direct database access is not recommended.


5. Now you only need to process the data correctly on the storefront and you're ready to go. So either redirect you user automatically, show the payment square or do something else. We tried to make it generic so that it's not anyhow limiting for your specific use-case.

## Recommendations
Because online payments are crucial part for customer's safety and comfort, we recommend to use online payment gateways that are known to the users in specific country. For example, don't use czech payment gateway for german customers and vice-versa. Use something that your customers know and are familiar with. Due to that we decided that we will allow to bind payment method implementation to every country variant.


# Connecting external services (`NotificationAPI`)
This comprehensive guide will provide you with all the necessary information to seamlessly extend ecoseller's functionality by leveraging external APIs. With the Notification API, you can effortlessly integrate your own systems and services to respond to specific events within the ecoseller platform, such as product save, order save, and more.

The ecoseller Notification API empowers you to enhance your ecoseller experience by enabling real-time communication and synchronization with external applications. By leveraging this API, you can ensure that your external systems stay up to date with the latest changes and events happening within ecoseller, allowing for a seamless and efficient workflow.

This documentation will walk you through the entire process of integrating the Notification API into your application. You'll learn how to configure endpoints and interpret the data sent by ecoseller. 

### Key Features of the ecoseller Notification API:

**Event-based Triggers:** The notifications API allows you to define specific events within ecoseller, such as `PRODUCT_SAVE` and `ORDER_SAVE`. These events serve as triggers for the notifications.

**Multiple Notification Types:** The API supports various notification types, including `RECOMMENDERAPI`, `HTTP`, and `EMAIL`. You can choose the appropriate type based on your integration requirements.

**Flexible Methods:** Each notification type can have different methods associated with it. For example, for the `RECOMMENDERAPI` type, the method `store_object` is used, while for the `HTTP` type, methods like `POST` are utilized.

**HTTP Integration:** The API allows you to send HTTP requests to external endpoints by specifying the URL. This enables seamless integration with other systems or services that can receive and process the notifications.

**Email Notifications:** With the "EMAIL" type, you can send email notifications related to specific events. In the given configuration file, the "send_order_confirmation" method is used to trigger the sending of an order confirmation email.
Customization: The JSON configuration file provides flexibility for customization. You can easily add or modify notification types, methods, and URLs based on your specific integration requirements.

**Expandable Event List:** The JSON configuration can be extended to include additional events and corresponding notifications. This allows you to adapt the API to match a wide range of events and actions within the ecoseller platform.

By leveraging these key features of the notifications API, you can extend the functionality of ecoseller by seamlessly integrating with external systems, such as recommender engines, HTTP-based APIs, and email services. This enables you to create powerful workflows and automate processes based on specific events occurring within ecoseller.


## Usage
Here is some example (default) NotificationAPI configuration.

### Configuring Notification API configuration
To configure your notifications, you need to edit provided JSON configurations in the Core component.

The provided configuration might look like this:
```JSON
{
    "PRODUCT_SAVE": [
        {
            "type": "RECOMMENDERAPI",
            "method": "store_object"
        },
        {
            "type": "HTTP",
            "method": "POST",
            "url": "http://example.com/api/product"
        }
    ],
    "ORDER_SAVE": [
        {
            "type": "HTTP",
            "method": "POST",
            "url": "http://example.com/api/order"
        },
        {
            "type": "EMAIL",
            "method": "send_order_confirmation"
        }
    ]
}
```

As you can see, for every trigger you can setup list of events that will be performed. There are multiple actions you can perform:

* `HTTP` type: this action requires to have `method` and `url` provided. As the title says, `method` is mean as an HTTP Method. You can use all methods utilized by [Python `requests` module](https://requests.readthedocs.io/en/latest/).

* `EMAIL` type: you can control sending e-mails using internal `email app`. Feel free to remove e-mail events that you don't want to be sent using the Django interface.

* `RECOMMENDER` type: if you don't want to use provided recommendation system feature, feel free to remove events providing data to the recommender.

We recommend to edit configuration JSON directly (core/config/notifications.json). However, you can define your custom one and installing it by setting `NOTIFICATIONS_CONFIG_PATH` as your environment variable. 


## TODO:

* List of triggers
# Search engine
**ecoseller** incorporates Elasticsearch as a component of its technology stack. Elasticsearch is a powerful search engine that enables **ecoseller** to deliver fast and accurate search results.
## Indexing products to Elasticsearch

To ensure efficient product searches and recommendations within Ecoseller, it is crucial to index your products in Elasticsearch. Ecoseller provides a convenient CLI command within the backend container to perform this indexing process.

To index your products using the CLI command, follow these steps:

1. Access the `backend` container: If you are running **ecoseller** locally using Docker, open your terminal and navigate to the Ecoseller project directory. Use the following command to access the `backend` container: `docker exec -it <your_backend_container_id_or_name> /bin/bash`
2. Run the indexing command: Once inside the `backend` container, run the following command to index the products in Elasticsearch: `python3 manage.py search_index --rebuild`
This command triggers the indexing process, where the products will be parsed, analyzed, and stored in Elasticsearch for efficient searching and recommendation functionalities.

Note: Ensure that you are in the correct directory within the backend container (usually the project's root directory) before executing the command.

The indexing process may take some time, depending on the size of your product database. Once the process is complete, your products will be fully indexed and ready for efficient searching and recommendation generation within Ecoseller.


### Automation with CRON job
You can also automate the indexing process by scheduling a CRON job to run the indexing command at specified intervals. This ensures that your Elasticsearch index stays up to date with any changes in your product database. Set up a CRON job with the following command:
`0 2 * * * docker exec <your_backend_container_id_or_name> python3 manage.py search_index --rebuild`

## Turning off Elasticsearch
If you no longer wish to use Elasticsearch in your Ecoseller setup, you can easily disable it by adjusting the environment variables and stopping the Elasticsearch container. Follow the steps below to turn off Elasticsearch:
1. Update environment variables: (please see dedicated section for environment variables in the installation guide) Set the `USE_ELASTIC` variable to `0` in the `backend` env file.
2. Stop the Elasticsearch container
3. Restart the `backend` container

With these steps completed, Elasticsearch will be disabled in your Ecoseller setup. However, please note that this will also disable the fast search functionality within Ecoseller. Therefore, it is recommended to keep Elasticsearch enabled for user experience.

