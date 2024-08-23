export const productValidationSchema = {
  category: {
    isIn: {
      options: [["HEADPHONES", "SPEAKERS", "EARPHONES"]],
      errorMessage: "Category must be one of HEADPHONES, SPEAKERS, or EARPHONES",
    },
    notEmpty: {
      errorMessage: "Category is required",
    },
  },
  name: {
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Product name must be between 3 and 100 characters long",
    },
    notEmpty: {
      errorMessage: "Product name is required",
    },
  },
  description: {
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: "Product description must be between 10 and 1000 characters long",
    },
    notEmpty: {
      errorMessage: "Product description is required",
    },
  },
  price: {
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
    notEmpty: {
      errorMessage: "Price is required",
    },
  },
  features: {
    isArray: {
      errorMessage: "Features must be an array",
    },
  },
  inBox: {
    isArray: {
      errorMessage: "In-box items must be an array",
    },
  },
  "inBox.*.item": {
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "item name must be between 3 and 100 characters long",
    },
    notEmpty: {
      errorMessage: "item is required",
    },
  },
  "inBox.*.quantity": {
    isInt: {
      options: { min: 0 },
      errorMessage: "item quantity must be a non-negative number",
    },
    notEmpty: {
      errorMessage: "item quantity is required",
    },
  },
  mainImage: {
    notEmpty: {
      errorMessage: "Main image URL is required",
    },
  },
  otherImages: {
    isArray: {
      errorMessage: "Other images must be an array",
    },
  },
  inStock: {
    isInt: {
      options: { min: 0 },
      errorMessage: "Stock quantity must be a non-negative number",
    },
    notEmpty: {
      errorMessage: "Stock quantity is required",
    },
  },
};

export const userValidationSchema = {
  username: {
    isString: true,
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Username should be at least 3 characters long",
    },
    notEmpty: {
      errorMessage: "Username is required",
    },
  },
  password: {
    isString: true,
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "Please provide a valid email address",
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  balance: {
    isFloat: {
      options: { min: 0 },
      errorMessage: "Balance must be a positive number",
    },
    optional: true,
  },
  cart: {
    isMongoId: true,
    optional: true,
    errorMessage: "Cart ID must be a valid Mongo ID",
  },
};

export const cartValidationSchema = {
  productId: {
    isMongoId: true,
    errorMessage: "Product ID must be a valid Mongo ID",
  },
  quantity: {
    notEmpty: {
      errorMessage: "Quantity is required",
    },
  },
};

export const checkoutValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Name should be at least 3 characters long",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
  },
  phoneNumber: {
    notEmpty: {
      errorMessage: "Phone number is required",
    },
    isMobilePhone: {
      options: ["any"],
      errorMessage: "Invalid phone number format",
    },
  },
  address: {
    notEmpty: {
      errorMessage: "Address is required",
    },
    isLength: {
      options: { min: 5 },
      errorMessage: "Address should be at least 5 characters long",
    },
  },
  zipCode: {
    notEmpty: {
      errorMessage: "Zip code is required",
    },
  },
  city: {
    notEmpty: {
      errorMessage: "City is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "City should be at least 3 characters long",
    },
  },
  country: {
    notEmpty: {
      errorMessage: "Country is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Country should be at least 3 characters long",
    },
  },
  paymentMethod : {
    notEmpty : {
      errorMessage : "Payment method is required"
    },
    isIn : {
      options : [["e-money", "cash-on-delivery"]],
      errorMessage : "Payment method must be one of e-money or cash-on-delivery"
    }
  }
};
