import { body, validationResult } from "express-validator";

const registerValidations = () => {
  return [
    body("email", "Please enter a valid email").isEmail().isLength({ max: 50 }),
    body(
      "firstname",
      "First name must be between 3 and 30 characters "
    ).isLength({ max: 30, min: 3 }),
    body("lastname", "Last name must be between 3 and 30 characters ").isLength(
      { max: 30, min: 3 }
    ),
    body("password", "password must contain at least 7 characters").isLength({
      min: 7,
    }),
    body("phone", "Phone number must contain at least 10 characters").isMobilePhone().isLength({
      min: 10,
    }),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
  ];
};

const taskValidation = () =>{
  return [
    body("task_name", "Task name must contain at least three characters").isLength({min: 3}),
    body("deadline", "Valid deadline is required").notEmpty()
  ]
}

const loginValidation = () =>{
  return [
    body("email", "Valid email is required").isEmail(),
    body("password", "Password must contain at least 7 characters").isLength({min: 7}),
  ] 
}

const errorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next()
};

export {registerValidations, errorMiddleware, loginValidation, taskValidation}