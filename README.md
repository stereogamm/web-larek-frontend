# Project "Vibe market: come in, grab it, you won't regret it" 🛒 

💡
This is a web application for managing a product catalog and shopping cart. The user can browse products, add them to the cart, and place orders. The project is built using the OOP paradigm.

---

🛠️ Tech Stack\
✳️ JS\
✳️ TypeScript\
✳️ HTML\
✳️ SCSS\
✳️ Webpack\

🏗 Project Architecture
- MVP (Model-View-Presenter) — separation of application logic:\
- Model — data management\
- View — information display\
- Presenter — connects Model and View\

🔦 Project structure:
- src/ — source files of the project
- src/components/ — folder with JS components
- src/components/base/ — folder with base code

🔦 Important files:
- src/pages/index.html — HTML file of the main page
- src/types/index.ts — file with types
- src/index.ts — application entry point
- src/scss/styles.scss — root styles file
- src/utils/constants.ts — file with constants
- src/utils/utils.ts — file with utilities

## Installation and launch 🛠️
To install and run the project, execute the commands

```
npm install
npm run start
```

or

```
yarn
yarn start
```
## Build

```
npm run build
```

or

```
yarn build
```

# Description of data interfaces and data types used in the application 
```

interface for product data
export interface IItem {
    category: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
    id: string;
}
```
```

interface for application state
export interface IDataHandler {
    productList: IItem[];
    basket: IItem[];
    order: IOrder;
    preview: string; id of the opened card
    saveProductList(items : IItem[]): void; save the product list received from the server
    addItemToBasket(item: string, payload: Function | null): void; add product by id to the basket
    deleteItemFromBasket(item: string, payload: Function | null): void; remove product by id from the basket
    resetBasket(): void; clear data after a successful order
    showOneItem(items: IItem[], id: string): object; open card for viewing by id
    getTotalSum(): number; total sum of products in the basket/total order cost
}
```
```

interface for order data
interface IOrder {
    email: string;
    phone: string;
    address: string;
    payment: string;
    items: string[];
    total: number | null;
}
```
```
interface for Card class instance
interface ICard {
    title: string;
    description?: string;
    image?: string;
    price: number | null;
    category?: string;
    itemNumber?: number;
    deleteButton?: string;
    id: string;
}
```
```

interface for basket
interface IBacket {
    items: IItem[];
    total: number | null;
    resetBasket(): void; clear data after a successful order
}
```
```

interface for order result
export interface IOrderResult {
    id: string;
    total: number | null;
}
```
```

interface for error validation
export type IFormErrors = Partial<Record<keyof IOrder, string>>;
```
```

interface for form fields
export type TOrderForm = Pick<IOrder,  'address' | 'payment' | 'email' | 'phone'>
```
```

data type for successful order modal window
export type OrderSuccessPopup = Pick<IOrder, 'total'>;
```
```

interface for Api class instance
interface IApi {
    getItems: () => Promise<IItem[]>;
    createOrder: (order: IOrder) => Promise<IOrderResult>;
}
```
```

types for event emitter class instance
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
}
```
```

interface for basket class instance
interface IBasket {
    items: HTMLElement[];
    total: number;
}
```
```

IInputsValidate {
    valid: boolean;
    errors: string[];
}
```
```

interface for page class instance
IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

# Application Architecture 💡

## The application implements layer separation in the MVP paradigm 

- *Data layer* - responsible for storing and working with data - `Models`
- *View layer* - responsible for displaying data on the page - `View`
- *Binding layer* with access to models and views - `Presenter`

# Base Code 💡

### Base class `Api` ✅

Implements logic for working with the server. Contains a constructor to create an object with base URL properties and request headers.

- `constructor(baseUrl: string, options: RequestInit = {})`- takes a base URL and global options for all requests (optional).

Also contains `get` and `post` methods, which handle request formation and asynchronous sending, calling the protected method `handleResponse`. The `handleResponse` method asynchronously converts the server response to json format in case of success and returns it, in case of failure - returns the statusText field value.  

### Base class `Component` ✅

Represents an `abstract` base class for creating components that work with DOM elements. It provides several methods for managing elements on the page. Subclasses can use these methods to manage DOM elements.

Constructor takes container and saves it. The constructor is protected, meaning instances of this class cannot be created directly, but it can be called from subclasses.

An HTML element is passed to the constructor and saved in the private field container. This allows child classes to work with this element.

Contains methods:

- `toggleClass` Method to toggle a class on an element. Uses classList.toggle to add or remove a class depending on the force value.
- `setText` Sets the text content of an element. Converts value to string and assigns it to textContent.
- `setDisabled` Sets or removes the disabled attribute of an element depending on the state value.
- `setHidden` Hides the element by setting its display style to none.
- `setVisible` Shows the element by removing the display property.
- `setImage` Sets the image source and alt text.
- `render` Updates the instance data by copying properties from data to the current object using Object.assign. Then returns the container.

### Base class `EventEmitter` ✅

This class is an event management system, allowing adding, removing, and calling event handlers.
The constructor creates an empty `Map` object to store events and their subscribers.

- `constructor()={}`

The class is used in the presenter for event handling and in application layers for generating events.
- Method `on` - adds a handler for a specific event.
- Method `off` - removes a handler for a specific event.
- Method `emit` - calls all handlers for the specified event, passing them data.
- Method `onAll` - adds a handler that will be called for all events.
- Method `offAll` - removes all handlers for all events.
- Method `trigger` - creates a trigger function that, when called, initiates an event with a specified name and data.

### Base class `Model` ✅

This class provides a foundation for creating models that can handle events, making it easier to manage data changes and synchronization. An abstract class cannot be instantiated directly, and it is intended to be extended by other classes.

It contains a constructor that takes a `data` object with partial `T` type data and an `events` object responsible for event handling.

- `Object.assign(this, data)` This method is used to copy all enumerable properties from the `data` object into the current instance (`this`).
- `emitChanges(event: string, payload?: object)` A method that notifies when the model has changed by triggering an event.

# Data Layer 💡

### Class `DataHandler` ✅

Responsible for data and business logic related to products.

Contains the following fields:
- `productList: IItem[]` A list of product card objects displayed on the main page.\
- `basketList: IItem[]` A list of objects representing items in the shopping cart.
- `preview: IItem` The currently opened product card for preview.
- `total: number | null` The total cost of all items.
- `order: IOrder` = { Order object\
        `email: ,\`
        `phone: ,\`
        `address: ,\`
        `payment: ,\`
        `items: [,\`
        `total: \`
    };
- `formErrors: IFormErrors = {}` An object containing form validation errors.

Class methods for interacting with data:

- `setProductList(items: IItem[])` Assigns received data from the server to `productList`.
- `showOneItem(id: string)` Returns the opened product card object for viewing by `id`.
- `addItemToBasket(item: IItem)` Adds a product to the cart.
- `removeItemFromBasket(id: string)` Removes a product from the cart.
- `resetBasket()` Clears the cart.
- `resetOrder()` Clears order data after successful completion.
- `getTotalSum()` Calculates the total cost of all products.
- `getCountBasketItems()` Returns the number of items in the cart for displaying the counter on the main page.
- `validationOrderInfoIsChecked()` Checks if the payment method and address fields are filled.
- `validationUserInfoIsChecked()` Checks if the email and phone fields are filled.
- `setOrder()` Adds the product `id` to the order field.
- `setPreview(id: string)` Saves the `id` of the opened product card.
- `getPreview()` Retrieves the `id` of the opened product card.
- `getBasketList()` Retrieves the list of cart items.
- `setPaymentType(value: string)` Saves the selected payment type.
- `get payment()` Retrieves the current payment method.
- `set _total` Updates the total cost of products.

# Presentation Layer 💡

Responsible for rendering the passed data inside a DOM element.

### Class `Basket` ✅

The `Basket` class extends the base `Component` class and is responsible for displaying the shopping cart items.

Contains the following fields:
- `_list: HTMLElement;` The list of items in the cart.\
- `_total: HTMLElement;` The total number of items in the cart.\
- `_button: HTMLButtonElement;` The button for placing an order.\

The constructor takes an `HTMLElement` and an instance of an event emitter.

Class methods:

- `set items(items: HTMLElement[])` Sets the items in the cart, replacing the list contents with new elements or a message indicating no items in the cart.
- `set total(total: number)` Sets the total order amount.

### Class `Card` ✅

Handles product card data and extends the base `Component` class.

The constructor takes the block name, container, and an event emitter instance.

Class methods:

- `set title(value: string)` Sets the title text.
- `set description(value: string)` Sets the description text.
- `set image(value: string)` Sets the image URL.
- `set price(value: number | null)` Sets the price. If the price is `null`, the action button is disabled, and the price text is set to "Priceless."
- `set category(value: string)` Sets the product category and adds the corresponding CSS class.
- `set id(id: string)` Sets the product identifier.
- `set itemNumber(value: number)` Sets the product number in the cart.
- `set textButton(value: string)` Sets the action button text.
- `get id()` Returns the product identifier.
- `get title()` Returns the product title text.
- `get cardButton()` Returns the action button if it exists.

### Class `ContactsForm` ✅

This class extends the base `Form` class and is designed to handle the contact details form. It includes methods for managing the values of email and phone fields and clearing them.

constructor(protected container: HTMLFormElement, protected events: IEvents)

Calls the base `Form` class constructor, passing the form container and the event object.\
Initializes `_email` and `_phone` fields for storing references to the corresponding input elements in the form.\

Class methods:

- `get phone(): string` Returns the current phone field value.
- `set phone(value: string)` Sets a new phone field value.
- `get email(): string` Returns the current email field value.
- `set email(value: string)` Sets a new email field value.
- `clearContactsFormFields()` Clears the phone and email field values, setting them to empty strings.

### Class `Form` ✅

This class extends the base `Component` class. It is designed to manage a form and includes methods for handling input changes, managing form state, and displaying errors.

constructor(protected container: HTMLFormElement, protected events: IEvents)

The constructor takes a form element and an event emitter instance.\
Calls the base `Component` class constructor.\
Initializes `_submit` and `_errors` elements for storing references to the submit button and the error container in the form.\
Adds event handlers for input changes and form submission.\

Class methods:

- `protected onInputChange(field: keyof T, value: string)` Called when an input field in the form changes. It triggers an event with the name formatted as `formName.fieldName:change`, passing the changed field and its value.
- `set valid(isValid: boolean)` Sets the submit button state (enabled or disabled) based on `isValid`.
- `set errors(value: string)` Sets the text content of the error element.
- `render(state: Partial<T> & IInputsValidate)` Renders the form state, calls the base `Component` class `render` method, and updates the current object with values from `state`.

### Class `Modal` ✅

This class extends the base `Component` class and is designed for managing modal windows, including opening, closing, and changing their content.

constructor(container: HTMLElement, protected events?: IEvents)

The constructor takes a modal window element and an event emitter instance.\
Calls the base `Component` class constructor.\
Initializes `_content` and `_closeButton` elements for storing references to the modal content and the close button.\
Adds event handlers for closing the modal window when clicking the close button, clicking outside the content, or pressing the Escape key.\

Class methods:

- `closeModalWindow()` Removes the `modal_active` class from the container, hiding the modal window.
- `set content(value: HTMLElement)` Replaces the `_content` with the new value.
- `openModalWindow()` Adds the `modal_active` class to the container, displaying the modal window.
- `render(data: IModalWindow): HTMLElement` Responsible for rendering.

### Class `Page` ✅

This class extends the base `Component` class and manages page elements such as the cart counter, product catalog, page wrapper, and cart.\

constructor(container: HTMLElement, protected events: IEvents)

The constructor takes an element and an event emitter instance, calling the base `Component` class constructor.\
Initializes `_counter`, `_catalog`, `_wrapper`, and `_basket`, representing the cart counter, product catalog, page wrapper, and cart respectively.\
Adds an event handler for `_basket`, triggering the `basketIs:opened` event when clicked.\

Class methods:

- `set catalog(items: HTMLElement[])` Replaces `_catalog` contents with new items.
- `set counter(value: number)` Sets the counter value.
- `set locked(value: boolean)` Adds or removes the `page__wrapper_locked` class from `_wrapper`, locking the page.

### Class `PaymentAddressForm` ✅

The class extends the functionality of the base `Form` class to manage a form for selecting a payment method and entering an address. This class includes event handling for payment selection buttons and the address input field, as well as methods for toggling and styling the buttons.\

#### `constructor(protected container: HTMLFormElement, protected events: IEvents)`

The constructor takes an element and an event emitter instance. It calls the constructor of the base `Form` class. It initializes the `_card`, `_cash`, and `_address` elements, representing the buttons for selecting card and cash payments, as well as the address input field. It adds event handlers for the `_card` and `_cash` buttons, which switch the payment method on click. It also adds an event handler for the `_address` field that emits an event when text is entered.\

#### Class methods:

- `toggleCashPayment(value: boolean)` - Toggles the `button_alt-active` class for the `_cash` button based on the `value`.
- `toggleCardPayment(value: boolean)` - Toggles the `button_alt-active` class for the `_card` button based on the `value`.
- `paymentSwitch(payment: string)` - Determines which payment method is selected, toggles the appropriate classes for `_card` and `_cash` buttons, and emits either the `paymentOnLine:selected` or `paymentCash:selected` event depending on the chosen method.
- `clearAddressField()` - Clears the `_address` field value.

---

### Class `SuccessOrder` ✅

The class represents a component for displaying information about a successfully placed order. It extends the functionality of the base `Component` class and adds logic for displaying the total order amount and closing the popup.\

#### `constructor(container: HTMLElement, protected events: IEvents)`

The constructor takes an element and an event emitter instance. It calls the constructor of the base `Component` class with the provided container. It initializes the `_total` and `_close` elements using the `ensureElement` function to ensure they exist in the DOM. It adds a click event handler to the `_close` button, which emits the `order:created` event via the `events` object.\

#### Class method:

- `set total(value: number)` - Sets the text content of the `_total` element, displaying the total order amount passed in the `value` parameter.

---

### Class `AppApi` ✅

This class extends the base `Api` class and implements the `IApi` interface. `AppApi` is designed for interacting with the API and includes methods for retrieving a list of items and creating an order.

#### Methods:

- `getItems` - Returns a promise that resolves to an array of `IItem` objects.
- `createOrder` - Accepts an `IOrder` object and returns a promise that resolves to an `IOrderResult` object.

#### Constructor parameters:

- `cdn` - A string representing the CDN content URL.
- `baseUrl` - The base URL for the API.
- `options` - Optional settings for requests.

The constructor calls the parent `Api` class constructor, passing `baseUrl` and `options`, and initializes the `cdn` field.

#### Class methods:

- `getItems` - Sends a `GET` request to `/product/` and processes the received data. Returns a promise that resolves to an array of `IItem` objects. Each item in the array receives a full image URL using the `cdn` property.
- `createOrder` - Sends a `POST` request with order data to the `/order` endpoint and returns a promise that resolves to an `IOrderResult` object.

---

## Communication Layer 🫱🏻‍🫲🏽 

This layer is responsible for server interaction.\
All interactions are event-driven.

1. **Fetching data → Generating events → Performing actions**\
2. **Data in the model changes → Event is generated → Actions are performed**

---

## Component Interaction 💡

The code describing the interaction between the view layer and the data layer is located in the `index.ts` file, which acts as a presenter.\
Interaction is carried out using events generated by an event broker and event handlers described in `index.ts`.\
In `index.ts`, instances of all necessary classes are first created, and then event handling is configured.

### *List of all events that can be generated in the system:* 💡

#### *Data change events (generated by data model classes)* ✴️

- `itemsData:changed` - Change in the array of item cards.
- `itemsData:selected` - Change in the selected card displayed in a modal window.
- `basketData:changed` - Change in cart data.
- `userData:changed` - Change in user data when filling out the form.
- `datapaymentform:opened` - Addition of a product ID to the order field.
- `order:ready` - Formation of order data.
- `preview:changed` - Change in preview field data.
- `paymentType:buttonSelected` - Change in the `payment` field value.
- `Info:loaded` - Successful server data loading.
- `item:addToBasket` - Adding an item to the cart.
- `item:rmFromPreorder` - Removing an item from the cart.
- `orderItems:added` - Adding selected product IDs to the order.
- `paymentOnLine:selected` - Card payment selected.
- `paymentCash:selected` - Cash payment selected.
- `order:created` - Order successfully placed.

#### *User interaction events (generated by view-related classes)* ✴️

- `card:selected` - Clicking on a card on the main page.
- `basketIs:opened` - Opening the modal window with the product list by clicking the cart icon on the main page.
- `item:updateBasket` - Adding/removing an item by clicking the button in the card preview.
- `datapaymentform:opened` - Opening the modal window with the payment form.
- `contacts:submit` - Submitting an order.
- `formErrors:change` - Form data validation event.
- `modal:open` - Modal window opened.
- `modal:close` - Modal window closed.