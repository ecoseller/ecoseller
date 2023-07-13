---
title: Authorization
category: Administration documentation
order: 4
---

To achieve better security, ecoseller introduces so-called *Roles*. Each role has a set of permissions. Permissions are used to restrict access to certain parts of the application. For future use, ecoseller creates a new permission (more precisely four for each action - add/change/view/delete) for each model. At this moment, ecoseller is actively using the following permissions:
```
- add role                  | group_add_permission
- change role               | group_change_permission
- can change cart           | cart_change_permission
- add category              | category_add_permission
- change category           | category_change_permission
- add page (cms)            | page_add_permission
- change page (cms)         | page_change_permission
- change product price      | productprice_change_permission
- add product price         | productprice_add_permission
- add product media         | productmedia_add_permission
- change product media      | productmedia_change_permission
- add product type          | producttype_add_permission
- change product type       | producttype_change_permission
- add product               | product_add_permission
- change product            | product_change_permission
- add user                  | user_add_permission
- change user               | user_change_permission
- add price list            | pricelist_add_permission
- change price list         | pricelist_change_permission
- add attribute type        | attributetype_add_permission
- change attribute type     | attributetype_change_permission
- add base attribute        | baseattribute_add_permission
- change base attribute     | baseattribute_change_permission

```

Ecoseller also comes with three predefined roles with the following permissions:
```
Editor permissions:
    -can change cart 
    -can change product price  
    -can add product price  
    -can change product media 
    -can add product media 
    -can change product 
    -can add product 
    -can change category 
    -can add category 
    -can change page (cms) 
    -can add page (cms) 
    -can add product type          
    -can change product type       
    -can add price list            
    -can change price list         
    -can add attribute type        
    -can change attribute type     
    -can add base attribute        
    -can change base attribute     

UserManager permissions:
    -can add user
    -can change user
    -can add group
    -can change group

Copywriter permissions:
    -can change page (cms)
    -can change product
    -can change product media
    -can change category
```

Ecoseller also comes with a predefined admin role that has all permissions. To allow users to specify new roles on deployment, we created a special config defined in `backend/core/roles/config/roles.json` (with predefined roles mentioned above) file with the following structure:
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

Each role has a unique name, description and a list of permissions. Each permission has a unique name, description, type and model. The type can be one of the following: `ADD`, `CHANGE`, `VIEW`, `DELETE`. The model is the name of the model to which the permission is assigned. The name of the model is the same as the name of the model in the database. For example, the name of the model for the `Product` model is `product`. The name of the model for the `ProductPrice` model is `productprice`. Each role and its corresponding permissions are created once the system is deployed during a migration process.

A description of the whole workflow with permissions (e.g. creating a new role, assigning it to specific users) can be found in the [Users & Roles](../../user/dashboard/#users--roles) section.

To ensure maximum security, the way roles affect workflow differs between the frontend and the backend. The following sections describe how.

### Backend
The backend uses decorators to restrict access to certain endpoints. Each endpoint has a corresponding decorator that checks if the user has the required permission. If the user does not have the required permission, the decorator returns a `403` response. More information about decorators can be found in the [Programming documentation](../../programming/programming/#backend).

### Frontend
The frontend uses context providers to hide/show or enable/disable certain components based on the user's permissions.Some components have a corresponding permission that is checked before the component is rendered. If the user does not have the required permission, the component is not rendered or is disabled. More information about context providers can be found in the [Programming documentation](../../programming/programming/#frontend).

#### Hiding components
In the dashboard, we have a sidebar with links to various parts of the system. Some links have a corresponding permission that is checked before the link is rendered. If the user does not have the required permission, the link is not rendered. Currently restricted links and their corresponding permissions are:
```
Products 
    - product_change_permission
    - product_add_permission
Categories
    - category_change_permission
    - category_add_permission
CMS 
    - page_change_permission 
    - page_add_permission
Users & Roles 
    - user_change_permission
    - user_add_permission
    - group_change_permission
    - group_add_permission
```
#### Disabling components
We restricted disabling to specific actions - e.g. button click or dragging component. Some components have corresponding permissions that are checked before the component itself is enabled. If the user does not have the required permission, the components are disabled, preventing the user to trigger further action. Some of the currently restricted actions and their corresponding permissions are:
```
Adding new category
    - category_add_permission
Adding/Dragging media components
    - productmedia_change_permission
Creating role
    - group_add_permission
Editing user general information
    - user_change_permission
```