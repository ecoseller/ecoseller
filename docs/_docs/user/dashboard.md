---
title: User documentation - Dashboard
category: User category
order: 2
---

# Overview
The Overview page provides summarised information about the store. It is the first page that is shown to the user after logging in. The page is divided into two main sections:
* Today's statistics
* Statistics for the last 30 days

## Today's statistics
For today's statistics, the following information is shown:
* Orders count
* Revenue
* Average order value
* Average items per order
* Top selling product

## Statistics for the last 30 days
For the last 30 days' statistics, the following information is shown:
* Orders count
* Revenue
* Average order value
* Average items per order
* Up to 5 top selling products
* Line graph showing orders count for the last 30 days

# Cart
# Orders
The orders page consists of a list showing all orders. The list has the following columns:
* Order token
* Status
* Customer email
* Created at
* Actions

![Orders list](../../images/orders_list.png)

The actions column contains the following buttons:
* Edit

## Edit
Clicking on the edit button opens the order details page.

## Order details
This page shows full information about the order. The page is divided into the following sections:
* Order items
* Status
* Shipping Info
* Billing info
* Shipping and payment methods

### Order items
This section shows a list of all items in the order. The list has the following columns:
* Product variant name - clicking on the name opens the product variant details page (described in TODO: add link)
* SKU
* Quantity
* Unit price (without VAT)
* Actions
  * Edit - admin is able to change the quantity of the product variant
  * Delete - admin is able to delete the product variant from the order
  
This section also shows the total price (without VAT) of a given order.

![Order items](../../images/order_items.png)

### Status
This section shows the current status of the order. The status can be changed by the admin using a drop-down menu.

![Order status](../../images/order_status.png)

### Shipping and billing info
This section shows the shipping and billing information of the order. It contains the same information as the shipping and billing information in the checkout process. Information is shown in the form view, and the admin is again able to modify its content.

|                     Shipping info                      |                     Billing info                     |
| :----------------------------------------------------: | :--------------------------------------------------: |
| ![Shipping info](../../images/order_shipping_info.png) | ![Billing info](../../images/order_billing_info.png) |

### Shipping and payment method
This section shows selected shipping and payment methods along with their prices.

TODO: add image

# Reviews
The reviews page consists of a list showing all reviews. The list has the following columns:
* Review token
* Product variant
* Product ID
* Rating
* Comment
* Created at
* Actions
  * Detail - clicking on the detail button opens the review details page (see [below](#review-details))
  * Delete - clicking on the delete button deletes the review

![Reviews list](../../images/reviews_list.png)

## Review details
This page shows full information about the review and overall rating of the product. The page is divided into the following sections:
* Rating - shown via stars and percentage
* Product ID
* Comment
* Average product rating

![Review detail](../../images/review_detail.png)
### Average product rating
This section shows the average rating of the product. The rating is shown via start and average score (value from 0 to 5). It also shows the number of reviews for the product and the distribution of ratings. Distribution values are rounded up - this means that if user submitted a rating of 4.5, it will be shown as 5 in the distribution.

# Catalog
# Localization
# CMS
# Users & Roles
# Recommender system